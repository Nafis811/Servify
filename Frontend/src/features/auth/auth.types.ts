export interface LoginFormState {
  email: string;
  password: string;
}

export interface RegisterFormState extends LoginFormState {
  name: string;
  phone: string;
  confirmPassword: string;
}

export type AuthRole = "customer" | "admin";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: AuthRole;
}

export interface AuthSession {
  user: AuthUser;
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: string;
  };
}
