import type { AuthSession } from "./auth.types";

const SESSION_STORAGE_KEY = "servify.session";
export const SESSION_CHANGE_EVENT = "servify-session-changed";

const isBrowser = () => typeof window !== "undefined";

const emitSessionChange = () => {
  if (!isBrowser()) {
    return;
  }

  window.dispatchEvent(new Event(SESSION_CHANGE_EVENT));
};

export const getStoredSession = (): AuthSession | null => {
  if (!isBrowser()) {
    return null;
  }

  const rawSession = window.localStorage.getItem(SESSION_STORAGE_KEY);

  if (!rawSession) {
    return null;
  }

  try {
    return JSON.parse(rawSession) as AuthSession;
  } catch {
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
    return null;
  }
};

export const storeSession = (session: AuthSession) => {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  emitSessionChange();
};

export const clearStoredSession = () => {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(SESSION_STORAGE_KEY);
  emitSessionChange();
};
