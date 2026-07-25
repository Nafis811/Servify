export interface AuthenticatedUser {
  id: string;
  email: string;
  role: "customer" | "admin";
  name?: string;
  phone?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export {};
