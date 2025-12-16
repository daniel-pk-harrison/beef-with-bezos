import { cookies } from "next/headers";

const AUTH_COOKIE_NAME = "beef-auth";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? "bezos123"; // Default for local dev
}

export async function verifyPassword(password: string): Promise<boolean> {
  const adminPassword = getAdminPassword();
  return password === adminPassword;
}

export async function setAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
}

export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(AUTH_COOKIE_NAME);
  return authCookie?.value === "authenticated";
}
