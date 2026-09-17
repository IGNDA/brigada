export interface Env {
  GALLERY_BUCKET: R2Bucket;
  ADMIN_SECRET: string;
}

interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  category: string;
  url: string;
  createdAt: string;
  size?: number;
}

interface GalleryManifest {
  updatedAt: string;
  items: GalleryItem[];
}

const MANIFEST_KEY = "manifest.json";
const CATEGORIES = [
  "cursos",
  "eventos",
  "resgates",
  "incendios",
  "educacao",
  "outros",
];
const MAX_SIZE_BYTES = 10 * 1024 * 1024;
const RATE_LIMIT_AUTH_MAX = 5;
const RATE_LIMIT_AUTH_WINDOW_MS = 60_000;
const RATE_LIMIT_UPLOAD_MAX = 20;
const RATE_LIMIT_UPLOAD_WINDOW_MS = 60_000;

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }
  if (entry.count >= maxRequests) return false;
  entry.count++;
  return true;
}

function clientIp(request: Request): string {
  return (
    request.headers.get("CF-Connecting-IP") ??
    request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...CORS_HEADERS,
    },
  });
}

function unauthorized(message = "Não autorizado"): Response {
  return json({ error: message }, 401);
}

function badRequest(message: string): Response {
  return json({ error: message }, 400);
}

function notFound(message = "Não encontrado"): Response {
  return json({ error: message }, 404);
}

function methodNotAllowed(): Response {
  return json({ error: "Método não permitido" }, 405);
}

async function sha256Hex(message: string): Promise<string> {
  const data = new TextEncoder().encode(message);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

const TOKEN_TTL_MS = 8 * 60 * 60 * 1000; // 8h

async function createToken(secret: string): Promise<string> {
  const exp = Date.now() + TOKEN_TTL_MS;
  const payload = `${exp}`;
  const signature = await sha256Hex(`${secret}:${payload}`);
  return `${payload}.${signature}`;
}

async function verifyToken(
  secret: string,
  token: string | null
): Promise<boolean> {
  if (!token) return false;
  const [expStr, signature] = token.split(".");
  if (!expStr || !signature) return false;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || Date.now() > exp) return false;
  const expected = await sha256Hex(`${secret}:${expStr}`);
  return expected === signature;
}

function sanitizeFilename(name: string, ext: string): string {
  const base = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  const id = crypto.randomUUID();
  return `${base || "image"}-${id}.${ext}`;
}

async function readManifest(env: Env): Promise<GalleryManifest> {
  const obj = await env.GALLERY_BUCKET.get(MANIFEST_KEY);
  if (!obj) {
    return { updatedAt: new Date().toISOString(), items: [] };
  }
  try {
    const parsed = (await obj.json()) as GalleryManifest;
    return {
      updatedAt: parsed.updatedAt ?? new Date().toISOString(),
      items: Array.isArray(parsed.items) ? parsed.items : [],
    };
  } catch {
    return { updatedAt: new Date().toISOString(), items: [] };
  }
}

async function writeManifest(
  env: Env,
  manifest: GalleryManifest
): Promise<void> {
  manifest.updatedAt = new Date().toISOString();
  await env.GALLERY_BUCKET.put(MANIFEST_KEY, JSON.stringify(manifest), {
    httpMetadata: { contentType: "application/json; charset=utf-8" },
  });
}

async function parseUpload(request: Request): Promise<{
  fields: Record<string, string>;
  buffer: ArrayBuffer;
  filename: string;
}> {
  const contentType = request.headers.get("Content-Type") ?? "";
  if (!contentType.includes("multipart/form-data")) {
    throw new Error("body-multipart");
  }
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    throw new Error("missing-file");
  }
  const buffer = await file.arrayBuffer();
  const fields: Record<string, string> = {};
  for (const [key, value] of form.entries()) {
    if (key !== "file") fields[key] = String(value);
  }
  return { fields, buffer, filename: file.name };
}

async function handleUpload(request: Request, env: Env): Promise<Response> {
  const ip = clientIp(request);
  if (
    !checkRateLimit(
      `upload:${ip}`,
      RATE_LIMIT_UPLOAD_MAX,
      RATE_LIMIT_UPLOAD_WINDOW_MS
    )
  ) {
    return json({ error: "Muitos uploads aguarde 1 minuto." }, 429);
  }

  const auth = request.headers.get("Authorization");
  if (
    !(await verifyToken(
      env.ADMIN_SECRET,
      auth?.replace(/^Bearer\s+/i, "") ?? null
    ))
  ) {
    return unauthorized();
  }

  let parsed;
  try {
    parsed = await parseUpload(request);
  } catch {
    return badRequest(
      "Envie um arquivo em formato multipart/form-data com o campo 'file'."
    );
  }

  if (parsed.buffer.byteLength > MAX_SIZE_BYTES) {
    return badRequest("Imagem muito grande (máx. 10MB).");
  }
  if (parsed.buffer.byteLength === 0) {
    return badRequest("Arquivo vazio.");
  }

  const category = CATEGORIES.includes(parsed.fields.category)
    ? parsed.fields.category
    : "outros";
  const title =
    (parsed.fields.title ?? "").trim().slice(0, 120) || "Sem título";

  const extMatch = parsed.filename.match(/\.([a-zA-Z0-9]+)$/);
  const ext = extMatch ? extMatch[1].toLowerCase() : "jpg";
  const url = `/imagens/${sanitizeFilename(parsed.fields.title || "image", ext)}`;

  await env.GALLERY_BUCKET.put(url.replace(/^\//, ""), parsed.buffer, {
    httpMetadata: { contentType: `image/${ext === "jpg" ? "jpeg" : ext}` },
  });

  const manifest = await readManifest(env);
  manifest.items.push({
    id: crypto.randomUUID(),
    title,
    description: (parsed.fields.description ?? "").trim() || undefined,
    category,
    url,
    createdAt: new Date().toISOString(),
    size: parsed.buffer.byteLength,
  });
  manifest.items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  await writeManifest(env, manifest);

  return json({ ok: true, item: manifest.items[0] }, 201);
}

async function handleDelete(
  request: Request,
  env: Env,
  id: string
): Promise<Response> {
  const auth = request.headers.get("Authorization");
  if (
    !(await verifyToken(
      env.ADMIN_SECRET,
      auth?.replace(/^Bearer\s+/i, "") ?? null
    ))
  ) {
    return unauthorized();
  }

  const manifest = await readManifest(env);
  const item = manifest.items.find((i) => i.id === id);
  if (!item) {
    return notFound("Item não encontrado.");
  }
  manifest.items = manifest.items.filter((i) => i.id !== id);
  await writeManifest(env, manifest);
  await env.GALLERY_BUCKET.delete(item.url.replace(/^\//, "")).catch(() => {});

  return json({ ok: true });
}

async function handleUpdate(
  request: Request,
  env: Env,
  id: string
): Promise<Response> {
  const auth = request.headers.get("Authorization");
  if (
    !(await verifyToken(
      env.ADMIN_SECRET,
      auth?.replace(/^Bearer\s+/i, "") ?? null
    ))
  ) {
    return unauthorized();
  }

  let body: { title?: string; description?: string; category?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return badRequest("Corpo inválido.");
  }

  const manifest = await readManifest(env);
  const item = manifest.items.find((i) => i.id === id);
  if (!item) {
    return notFound("Item não encontrado.");
  }

  if (body?.category && CATEGORIES.includes(body.category)) {
    item.category = body.category as (typeof CATEGORIES)[number];
  }
  if (typeof body?.title === "string") {
    item.title = body.title.trim().slice(0, 120) || "Sem título";
  }
  if (typeof body?.description === "string") {
    item.description = body.description.trim() || undefined;
  }

  await writeManifest(env, manifest);

  return json({ ok: true, item });
}

const worker = {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const path = url.pathname.replace(/\/+$/, "");

    if (path === "/api/gallery" && request.method === "GET") {
      const manifest = await readManifest(env);
      return json(manifest);
    }

    if (path === "/api/auth" && request.method === "POST") {
      const ip = clientIp(request);
      if (
        !checkRateLimit(
          `auth:${ip}`,
          RATE_LIMIT_AUTH_MAX,
          RATE_LIMIT_AUTH_WINDOW_MS
        )
      ) {
        return json({ error: "Muitas tentativas. Aguarde 1 minuto." }, 429);
      }
      try {
        const body = (await request.json()) as { password?: string };
        if (typeof body.password !== "string") {
          return badRequest("Informe a senha.");
        }
        if (body.password !== env.ADMIN_SECRET) {
          return unauthorized("Senha incorreta.");
        }
        const token = await createToken(env.ADMIN_SECRET);
        return json({ token });
      } catch {
        return badRequest("Corpo inválido.");
      }
    }

    if (path === "/api/upload" && request.method === "POST") {
      return handleUpload(request, env);
    }

    const deleteMatch = path.match(/^\/api\/item\/(.+)$/);
    if (deleteMatch && request.method === "DELETE") {
      return handleDelete(request, env, decodeURIComponent(deleteMatch[1]));
    }
    if (deleteMatch && request.method === "PATCH") {
      return handleUpdate(request, env, decodeURIComponent(deleteMatch[1]));
    }

    return methodNotAllowed();
  },
};

export default worker;
