import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../../config/env";
import { ApiError } from "../../shared/errors/api-error";
import { authRepository, InMemoryAuthRepository } from "./auth.repository";
import type { AuthSession, LoginInput, RegisterInput } from "./auth.types";
import { validateLoginInput, validateRegisterInput } from "./auth.validation";

interface AccessTokenPayload {
  sub: string;
  email: string;
  role: "customer" | "admin";
  tokenType: "access";
}

interface RefreshTokenPayload {
  sub: string;
  email: string;
  role: "customer" | "admin";
  tokenType: "refresh";
}

export class AuthService {
  constructor(private readonly repository: InMemoryAuthRepository = authRepository) {}

  private issueTokens(userId: string, email: string, role: "customer" | "admin"): AuthSession["tokens"] {
    const accessTokenOptions: SignOptions = {
      expiresIn: env.accessTokenTtl as SignOptions["expiresIn"],
    };

    const refreshTokenOptions: SignOptions = {
      expiresIn: env.refreshTokenTtl as SignOptions["expiresIn"],
    };

    const accessToken = jwt.sign(
      {
        sub: userId,
        email,
        role,
        tokenType: "access",
      } satisfies AccessTokenPayload,
      env.jwtSecret,
      accessTokenOptions
    );

    const refreshToken = jwt.sign(
      {
        sub: userId,
        email,
        role,
        tokenType: "refresh",
      } satisfies RefreshTokenPayload,
      env.jwtRefreshSecret,
      refreshTokenOptions
    );

    return {
      accessToken,
      refreshToken,
      expiresIn: env.accessTokenTtl,
    };
  }

  async register(input: RegisterInput): Promise<AuthSession> {
    const errors = validateRegisterInput(input);

    if (errors.length > 0) {
      throw new ApiError(422, "Registration validation failed", errors);
    }

    const existingUser = await this.repository.findByEmail(input.email);

    if (existingUser) {
      throw new ApiError(409, "Email is already registered");
    }

    const user = await this.repository.createUser({
      name: input.name,
      email: input.email,
      phone: input.phone,
      password: input.password,
    });

    const tokens = this.issueTokens(user.id, user.email, user.role);
    await this.repository.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      user: this.repository.toPublicUser(user),
      tokens,
    };
  }

  async login(input: LoginInput): Promise<AuthSession> {
    const errors = validateLoginInput(input);

    if (errors.length > 0) {
      throw new ApiError(422, "Login validation failed", errors);
    }

    const user = await this.repository.findByEmail(input.email);

    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid email or password");
    }

    const tokens = this.issueTokens(user.id, user.email, user.role);
    await this.repository.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      user: this.repository.toPublicUser(user),
      tokens,
    };
  }

  async logout(userId: string): Promise<void> {
    const updatedUser = await this.repository.updateRefreshToken(userId, null);

    if (!updatedUser) {
      throw new ApiError(404, "User session not found");
    }
  }

  async me(userId: string) {
    const user = await this.repository.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return this.repository.toPublicUser(user);
  }
}

export const authService = new AuthService();
