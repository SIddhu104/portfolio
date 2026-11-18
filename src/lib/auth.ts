import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_key_siddhesh_portfolio_2026";
export const AUTH_COOKIE_NAME = "siddhesh_admin_token";

export interface TokenPayload {
  adminId: string;
  email: string;
  role: string;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signAdminToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyAdminToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export function getAdminFromRequest(req: NextRequest): TokenPayload | null {
  // Check Authorization header first
  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    const decoded = verifyAdminToken(token);
    if (decoded) return decoded;
  }

  // Check HTTP-only cookie
  const cookie = req.cookies.get(AUTH_COOKIE_NAME);
  if (cookie?.value) {
    const decoded = verifyAdminToken(cookie.value);
    if (decoded) return decoded;
  }

  return null;
}
