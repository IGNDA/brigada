const BASE_PATH = "/brigada";
const isDev = process.env.NODE_ENV === "development";

export function url(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  // Next.js <Link> automatically prepends basePath from next.config.ts,
  // so we return plain paths here.
  return cleanPath;
}

export function fullUrl(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  if (isDev) return cleanPath;
  // For non-Link contexts (<a> tags, meta tags, etc.), Next.js does NOT
  // prepend basePath, so we add it manually.
  return `${BASE_PATH}${cleanPath}`;
}

export function asset(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  if (isDev) return cleanPath;
  return `${BASE_PATH}${cleanPath}`;
}

export const urls = {
  home: () => url("/"),
  quemSomos: () => url("/quem-somos"),
  atuacao: () => url("/atuacao"),
  gallery: () => url("/nossos-trabalhos"),
  faq: () => url("/faq"),
  jogos: () => url("/jogos"),
  jogosQuiz: () => url("/jogos/quiz"),
  jogosMemoria: () => url("/jogos/memoria"),
  jogosCacaPalavras: () => url("/jogos/caca-palavras"),
  jogosIncendio: () => url("/jogos/incendio"),
  admin: () => url("/admin"),
  adminLogin: () => url("/admin/login"),
  adminGallery: () => url("/admin/nossos-trabalhos"),
} as const;

export const urlsFull = {
  home: () => fullUrl("/"),
  jogos: () => fullUrl("/jogos"),
  jogosQuiz: () => fullUrl("/jogos/quiz"),
  jogosMemoria: () => fullUrl("/jogos/memoria"),
  jogosCacaPalavras: () => fullUrl("/jogos/caca-palavras"),
  jogosIncendio: () => fullUrl("/jogos/incendio"),
  admin: () => fullUrl("/admin"),
  adminLogin: () => fullUrl("/admin/login"),
  adminGallery: () => fullUrl("/admin/nossos-trabalhos"),
} as const;
