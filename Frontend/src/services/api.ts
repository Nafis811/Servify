import { getStoredSession } from "../features/auth/auth.session";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api";

type PrimitiveValue = string | number | boolean | null | undefined;

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const headers = new Headers(init.headers);

  if (!(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const storedSession = getStoredSession();

  if (storedSession?.tokens.accessToken && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${storedSession.tokens.accessToken}`);
  }

  const response = await fetch(`${API_BASE_URL}${normalizedPath}`, {
    ...init,
    headers,
  });

  const text = await response.text();
  let payload: { data?: T; message?: string } | undefined;

  if (text) {
    try {
      payload = JSON.parse(text) as { data?: T; message?: string };
    } catch {
      payload = undefined;
    }
  }

  if (!response.ok) {
    throw new Error(payload?.message ?? `Request failed with status ${response.status}`);
  }

  return (payload?.data ?? payload) as T;
}

export function toQueryString<T extends object>(params: T): string {
  const searchParams = new URLSearchParams();

  Object.entries(params as Record<string, PrimitiveValue>).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") {
      return;
    }

    searchParams.set(key, String(value));
  });

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}
