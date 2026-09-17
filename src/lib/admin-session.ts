const SESSION_KEY = "brigada-ignda-admin-token";

export function getSessionToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.sessionStorage.getItem(SESSION_KEY);
}

export function setSessionToken(token: string): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(SESSION_KEY, token);
}

export function clearSessionToken(): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(SESSION_KEY);
}
