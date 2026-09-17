export function url(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  // Next.js <Link> automatically prepends basePath from next.config.ts,
  // so we return plain paths here. Do NOT add basePath manually.
  return cleanPath;
}

export function asset(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  // For non-Link contexts (meta tags, OG images, etc.), Next.js does NOT
  // prepend basePath, so we add it manually in production.
  const isDev = process.env.NODE_ENV === "development";
  if (isDev) {
    return cleanPath;
  }
  return `/brigada${cleanPath}`;
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
