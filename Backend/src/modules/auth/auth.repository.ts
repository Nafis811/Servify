import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { prisma } from "../../lib/prisma";
import type { AuthUserRecord, PublicAuthUser, UserRole } from "./auth.types";

interface CreateUserInput {
  name: string;
  email: string;
  phone: string;
  password: string;
  role?: UserRole;
}

const refreshTokenStore = new Map<string, string | null>();

export class PrismaAuthRepository {
  async findByEmail(email: string): Promise<AuthUserRecord | undefined> {
    const normalizedEmail = email.trim().toLowerCase();

    // 1. Check Administrator table
    const admin = await prisma.administrator.findUnique({ where: { email: normalizedEmail } });
    if (admin) {
      return {
        id: admin.id,
        name: admin.nama,
        email: admin.email,
        phone: "",
        passwordHash: admin.password,
        role: "admin",
        refreshToken: refreshTokenStore.get(admin.id) ?? null,
        createdAt: admin.createdAt.toISOString(),
        updatedAt: admin.updatedAt.toISOString(),
      };
    }

    // 2. Check Customer table
    const customer = await prisma.customer.findUnique({ where: { email: normalizedEmail } });
    if (!customer) return undefined;
    return this.toRecord(customer);
  }

  async findById(id: string): Promise<AuthUserRecord | undefined> {
    // 1. Check Administrator table
    const admin = await prisma.administrator.findUnique({ where: { id } });
    if (admin) {
      return {
        id: admin.id,
        name: admin.nama,
        email: admin.email,
        phone: "",
        passwordHash: admin.password,
        role: "admin",
        refreshToken: refreshTokenStore.get(admin.id) ?? null,
        createdAt: admin.createdAt.toISOString(),
        updatedAt: admin.updatedAt.toISOString(),
      };
    }

    // 2. Check Customer table
    const customer = await prisma.customer.findUnique({ where: { id } });
    if (!customer) return undefined;
    return this.toRecord(customer);
  }

  async createUser(input: CreateUserInput): Promise<AuthUserRecord> {
    const passwordHash = await bcrypt.hash(input.password, 10);
    const customer = await prisma.customer.create({
      data: {
        // Customer.id gak lagi auto-generate (sejak sync Supabase Auth dipasang),
        // jadi wajib kasih id manual di sini kalau dead code ini dipakai lagi
        id: randomUUID(),
        nama: input.name.trim(),
        email: input.email.trim().toLowerCase(),
        noHp: input.phone.trim(),
        password: passwordHash,
        alamat: "", // belum dikumpulkan di form register, bisa dilengkapi user nanti
      },
    });
    return this.toRecord(customer);
  }

  async updateRefreshToken(id: string, refreshToken: string | null): Promise<AuthUserRecord | undefined> {
    const customer = await prisma.customer.findUnique({ where: { id } });
    if (!customer) return undefined;
    refreshTokenStore.set(id, refreshToken);
    return this.toRecord(customer);
  }

  toPublicUser(user: AuthUserRecord): PublicAuthUser {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  private toRecord(customer: {
    id: string;
    nama: string;
    email: string;
    noHp: string;
    password: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): AuthUserRecord {
    return {
      id: customer.id,
      name: customer.nama,
      email: customer.email,
      phone: customer.noHp,
      // password bisa null sekarang (customer yang sync dari Supabase Auth gak punya password di Prisma),
      // fallback ke string kosong biar tipe AuthUserRecord.passwordHash (string) tetap kepenuhi
      passwordHash: customer.password ?? "",
      role: "customer",
      refreshToken: refreshTokenStore.get(customer.id) ?? null,
      createdAt: customer.createdAt.toISOString(),
      updatedAt: customer.updatedAt.toISOString(),
    };
  }
}

export const authRepository = new PrismaAuthRepository();
