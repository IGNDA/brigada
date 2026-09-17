import type { GalleryManifest } from "@/lib/gallery";
import { WORKER_URL } from "@/lib/gallery";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${WORKER_URL}${path}`, {
    ...init,
    headers: {
      ...(init?.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...init?.headers,
    },
  });
  const data = (await res.json().catch(() => null)) as
    (T & { error?: string }) | null;
  if (res.status === 401) {
    const message =
      data && "error" in data && data.error && data.error !== "Não autorizado"
        ? data.error
        : "Sessão expirada. Faça login novamente.";
    const err = new Error(message) as Error & { status: number };
    err.status = 401;
    throw err;
  }
  if (!res.ok) {
    const message = data?.error ?? `Erro (${res.status})`;
    throw new Error(message);
  }
  return data as T;
}

export async function fetchGallery(): Promise<GalleryManifest> {
  return request<GalleryManifest>("/api/gallery");
}

export async function login(password: string): Promise<string> {
  const { token } = await request<{ token: string }>("/api/auth", {
    method: "POST",
    body: JSON.stringify({ password }),
  });
  return token;
}

export async function uploadImage(
  token: string,
  file: File,
  meta: { title: string; description?: string; category: string }
): Promise<void> {
  const form = new FormData();
  form.append("file", file);
  form.append("title", meta.title);
  if (meta.description) form.append("description", meta.description);
  form.append("category", meta.category);
  await request<{ ok: boolean }>("/api/upload", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
}

export async function deleteItem(token: string, id: string): Promise<void> {
  await request<{ ok: boolean }>(`/api/item/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function updateItem(
  token: string,
  id: string,
  fields: { title?: string; description?: string; category?: string }
): Promise<void> {
  await request<{ ok: boolean }>(`/api/item/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(fields),
  });
}
