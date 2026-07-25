export type UserRole = "customer" | "admin";

export interface AuthUserRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: UserRole;
  refreshToken?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PublicAuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface RegisterInput {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export interface AuthSession {
  user: PublicAuthUser;
  tokens: AuthTokens;
}
