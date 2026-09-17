const BASE_PATH = "/brigada";
const isDev = process.env.NODE_ENV === "development";

export function url(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  // In dev, basePath is not applied by next dev, so we return root-relative paths
  if (isDev) {
    return cleanPath === "/" ? "/" : cleanPath;
  }
  return `${BASE_PATH}${cleanPath}`;
}

export function asset(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  if (isDev) {
    return cleanPath;
  }
  return `${BASE_PATH}${cleanPath}`;
}

export const urls = {
  home: () => url("/"),
  quemSomos: () => url("/quem-somos"),
  atuacao: () => url("/atuacao"),
  gallery: () => url("/nossos-trabalhos"),
  faq: () => url("/faq"),
  admin: () => url("/admin"),
  adminLogin: () => url("/admin/login"),
  adminGallery: () => url("/admin/nossos-trabalhos"),
} as const;
