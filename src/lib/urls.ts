const BASE_PATH = "/brigada";

export function url(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${BASE_PATH}${cleanPath}`;
}

export const urls = {
  home: () => url("/"),
  gallery: () => url("/nossos-trabalhos"),
  admin: () => url("/admin"),
  adminLogin: () => url("/admin/login"),
  adminGallery: () => url("/admin/nossos-trabalhos"),
} as const;
