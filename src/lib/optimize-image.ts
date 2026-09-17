const MAX_DIMENSION = 1600;
const WEBP_QUALITY = 0.8;

export interface OptimizedImage {
  file: File;
  mimeType: string;
  extension: string;
}

async function loadImage(file: File): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.decoding = "async";
    await new Promise<HTMLImageElement>((resolve, reject) => {
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Não foi possível ler a imagem."));
      img.src = url;
    });
    return img;
  } finally {
    URL.revokeObjectURL(url);
  }
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number
): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

/**
 * Redimensiona e comprime uma imagem no navegador (canvas) antes do upload.
 * Retorna um File otimizado (WebP quando possível) e os metadados para o backend.
 */
export async function optimizeImage(input: File): Promise<OptimizedImage> {
  const isImage = input.type.startsWith("image/");
  const underMax = input.size <= 512 * 1024; // 512KB
  if (!isImage || underMax) {
    const ext = input.name.match(/\.([a-zA-Z0-9]+)$/)?.[1]?.toLowerCase();
    return {
      file: input,
      mimeType: input.type || "image/jpeg",
      extension: ext || "jpg",
    };
  }

  const img = await loadImage(input);
  const srcW = img.naturalWidth;
  const srcH = img.naturalHeight;
  if (!srcW || !srcH) {
    return {
      file: input,
      mimeType: input.type,
      extension:
        input.name.match(/\.([a-zA-Z0-9]+)$/)?.[1]?.toLowerCase() || "jpg",
    };
  }

  const scale = Math.min(1, MAX_DIMENSION / Math.max(srcW, srcH));
  const width = Math.max(1, Math.round(srcW * scale));
  const height = Math.max(1, Math.round(srcH * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return {
      file: input,
      mimeType: input.type,
      extension:
        input.name.match(/\.([a-zA-Z0-9]+)$/)?.[1]?.toLowerCase() || "jpg",
    };
  }
  ctx.drawImage(img, 0, 0, width, height);

  const webp = await canvasToBlob(canvas, "image/webp", WEBP_QUALITY);
  if (webp) {
    return {
      file: new File([webp], "upload.webp", { type: "image/webp" }),
      mimeType: "image/webp",
      extension: "webp",
    };
  }

  const jpeg = await canvasToBlob(canvas, "image/jpeg", 0.85);
  const blob = jpeg ?? (await canvasToBlob(canvas, input.type, WEBP_QUALITY));
  if (!blob) {
    return {
      file: input,
      mimeType: input.type,
      extension:
        input.name.match(/\.([a-zA-Z0-9]+)$/)?.[1]?.toLowerCase() || "jpg",
    };
  }
  const type = jpeg ? "image/jpeg" : input.type;
  const ext = jpeg
    ? "jpg"
    : input.name.match(/\.([a-zA-Z0-9]+)$/)?.[1]?.toLowerCase() || "jpg";
  return {
    file: new File([blob], `upload.${ext}`, { type }),
    mimeType: type,
    extension: ext,
  };
}
