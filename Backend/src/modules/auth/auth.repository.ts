import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import type { AuthUserRecord, PublicAuthUser } from "./auth.types";

interface CreateUserInput {
  name: string;
  email: string;
  phone: string;
  password: string;
  role?: AuthUserRecord["role"];
}

export class InMemoryAuthRepository {
  private readonly users = new Map<string, AuthUserRecord>();

  async findByEmail(email: string): Promise<AuthUserRecord | undefined> {
    const normalizedEmail = email.trim().toLowerCase();

    for (const user of this.users.values()) {
      if (user.email === normalizedEmail) {
        return user;
      }
    }

    return undefined;
  }

  async findById(id: string): Promise<AuthUserRecord | undefined> {
    return this.users.get(id);
  }

  async createUser(input: CreateUserInput): Promise<AuthUserRecord> {
    const now = new Date().toISOString();
    const id = `usr_${randomUUID()}`;
    const passwordHash = await bcrypt.hash(input.password, 10);
    const user: AuthUserRecord = {
      id,
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      phone: input.phone.trim(),
      passwordHash,
      role: input.role ?? "customer",
      refreshToken: null,
      createdAt: now,
      updatedAt: now,
    };

    this.users.set(id, user);
    return user;
  }

  async updateRefreshToken(id: string, refreshToken: string | null): Promise<AuthUserRecord | undefined> {
    const user = this.users.get(id);

    if (!user) {
      return undefined;
    }

    const updated: AuthUserRecord = {
      ...user,
      refreshToken,
      updatedAt: new Date().toISOString(),
    };

    this.users.set(id, updated);
    return updated;
  }

  toPublicUser(user: AuthUserRecord): PublicAuthUser {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }
}

export const authRepository = new InMemoryAuthRepository();
