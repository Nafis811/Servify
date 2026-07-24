import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../../services/supabase";
import { clearStoredSession, storeSession } from "./auth.session";
import type { AuthRole, AuthSession, LoginFormState, RegisterFormState } from "./auth.types";

const readMetadataValue = (value: unknown) => (typeof value === "string" ? value : "");

const toAuthSession = (session: Session | null): AuthSession | null => {
  if (!session) {
    return null;
  }

  const metadata = session.user.user_metadata ?? {};
  const role = readMetadataValue(metadata.role) === "admin" ? "admin" : "customer";
  const user: AuthSession["user"] = {
    id: session.user.id,
    name: readMetadataValue(metadata.name) || session.user.email || "User",
    email: session.user.email ?? "",
    phone: readMetadataValue(metadata.phone),
    role,
  };

  return {
    user,
    tokens: {
      accessToken: session.access_token,
      refreshToken: session.refresh_token ?? "",
      expiresIn: String(session.expires_at ?? ""),
    },
  };
};

const getUserProfile = (user: User) => {
  const metadata = user.user_metadata ?? {};
  const role = readMetadataValue(metadata.role) === "admin" ? "admin" : "customer";

  return {
    id: user.id,
    name: readMetadataValue(metadata.name) || user.email || "User",
    email: user.email ?? "",
    phone: readMetadataValue(metadata.phone),
    role: role as AuthRole,
  };
};

export const loginUser = async (payload: LoginFormState) => {
  const { data, error } = await supabase.auth.signInWithPassword(payload);

  if (error) {
    throw new Error(error.message);
  }

  const authSession = toAuthSession(data.session);

  if (!authSession) {
    throw new Error("Login session is unavailable");
  }

  storeSession(authSession);
  return authSession;
};

export const registerUser = async (payload: RegisterFormState) => {
  const { data, error } = await supabase.auth.signUp({
    email: payload.email,
    password: payload.password,
    options: {
      data: {
        name: payload.name,
        phone: payload.phone,
        role: "customer",
      },
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  const authSession = toAuthSession(data.session);

  if (authSession) {
    storeSession(authSession);
  }

  return authSession;
};

export const fetchCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }

  if (!data.user) {
    throw new Error("No active session");
  }

  return getUserProfile(data.user);
};

export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }

  clearStoredSession();
};
