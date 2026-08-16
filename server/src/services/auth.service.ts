import bcrypt from "bcryptjs";
import prisma from "../lib/prisma";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt";
import type { RegisterInput, LoginInput } from "../validators/auth.validators";

export class AuthError extends Error {
  constructor(message: string, public statusCode: number = 401) {
    super(message);
  }
}

export async function registerUser(input: RegisterInput) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw new AuthError("An account with this email already exists", 409);
  }

  const passwordHash = await bcrypt.hash(input.password, 10);

  const user = await prisma.user.create({
    data: { name: input.name, email: input.email, passwordHash },
  });

  return issueTokens(user.id, user);
}

export async function loginUser(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) {
    throw new AuthError("Invalid email or password", 401);
  }

  const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);
  if (!passwordMatches) {
    throw new AuthError("Invalid email or password", 401);
  }

  return issueTokens(user.id, user);
}

export async function refreshAccessToken(refreshToken: string) {
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new AuthError("Invalid or expired refresh token", 401);
  }

  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  if (!user) {
    throw new AuthError("User no longer exists", 401);
  }

  const accessToken = signAccessToken({ userId: user.id });
  return { accessToken, user: toPublicUser(user) };
}

function issueTokens(userId: string, user: { id: string; name: string; email: string }) {
  const accessToken = signAccessToken({ userId });
  const refreshToken = signRefreshToken({ userId });
  return { accessToken, refreshToken, user: toPublicUser(user) };
}

function toPublicUser(user: { id: string; name: string; email: string }) {
  // Never send passwordHash back to the client, even accidentally
  return { id: user.id, name: user.name, email: user.email };
}