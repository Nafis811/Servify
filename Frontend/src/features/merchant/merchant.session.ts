const MERCHANT_ID_KEY = "servify.merchant.mitraId";

export function getMitraId(): string | null {
  return window.localStorage.getItem(MERCHANT_ID_KEY);
}

export function setMitraId(mitraId: string): void {
  window.localStorage.setItem(MERCHANT_ID_KEY, mitraId);
}

export function clearMitraId(): void {
  window.localStorage.removeItem(MERCHANT_ID_KEY);
}
