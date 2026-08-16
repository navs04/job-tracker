import { Request, Response } from "express";
import { registerUser, loginUser, refreshAccessToken, AuthError } from "../services/auth.service";

const REFRESH_COOKIE_NAME = "refreshToken";
const REFRESH_COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days, matches token expiry

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: REFRESH_COOKIE_MAX_AGE,
};

export async function register(req: Request, res: Response) {
  try {
    const { accessToken, refreshToken, user } = await registerUser(req.body);
    res.cookie(REFRESH_COOKIE_NAME, refreshToken, cookieOptions);
    res.status(201).json({ accessToken, user });
  } catch (err) {
    handleAuthError(err, res);
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { accessToken, refreshToken, user } = await loginUser(req.body);
    res.cookie(REFRESH_COOKIE_NAME, refreshToken, cookieOptions);
    res.json({ accessToken, user });
  } catch (err) {
    handleAuthError(err, res);
  }
}

export async function refresh(req: Request, res: Response) {
  const token = req.cookies?.[REFRESH_COOKIE_NAME];
  if (!token) {
    return res.status(401).json({ error: "No refresh token provided" });
  }

  try {
    const { accessToken, user } = await refreshAccessToken(token);
    res.json({ accessToken, user });
  } catch (err) {
    handleAuthError(err, res);
  }
}

export function logout(_req: Request, res: Response) {
  res.clearCookie(REFRESH_COOKIE_NAME, cookieOptions);
  res.status(204).send();
}

function handleAuthError(err: unknown, res: Response) {
  if (err instanceof AuthError) {
    return res.status(err.statusCode).json({ error: err.message });
  }
  console.error(err);
  return res.status(500).json({ error: "Internal server error" });
}