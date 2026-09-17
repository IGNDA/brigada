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

export const urls = {
  home: () => url("/"),
  gallery: () => url("/nossos-trabalhos"),
  admin: () => url("/admin"),
  adminLogin: () => url("/admin/login"),
  adminGallery: () => url("/admin/nossos-trabalhos"),
} as const;
