export type GalleryCategory =
  "cursos" | "eventos" | "resgates" | "incendios" | "educacao" | "outros";

export interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  category: GalleryCategory;
  url: string;
  createdAt: string;
  size?: number;
}

export interface GalleryManifest {
  updatedAt: string;
  items: GalleryItem[];
}

export const CATEGORIES: Record<GalleryCategory, { label: string }> = {
  cursos: { label: "Cursos" },
  eventos: { label: "Eventos" },
  resgates: { label: "Resgates" },
  incendios: { label: "Incêndios" },
  educacao: { label: "Educação" },
  outros: { label: "Outros" },
};

export const WORKER_URL =
  process.env.NEXT_PUBLIC_GALLERY_WORKER_URL ??
  "https://bof-rj-gallery.<your-worker-subdomain>.workers.dev";

export const R2_PUBLIC_BASE = process.env.NEXT_PUBLIC_R2_PUBLIC_BASE ?? "";

export function itemImageUrl(item: GalleryItem): string {
  if (item.url.startsWith("http")) {
    return item.url;
  }
  return `${R2_PUBLIC_BASE.replace(/\/$/, "")}${item.url}`;
}
