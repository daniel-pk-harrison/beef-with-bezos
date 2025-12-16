import { cookies } from "next/headers";
import { createHmac, randomBytes, timingSafeEqual } from "crypto";

const AUTH_COOKIE_NAME = "beef-auth";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/**
 * Get the admin password from environment.
 * In production, this MUST be set - the app will fail otherwise.
 */
export function getAdminPassword(): string {
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "ADMIN_PASSWORD environment variable is required in production"
      );
    }
    // Only allow default in development
    return "bezos123";
  }

  return password;
}

/**
 * Get the secret key for signing cookies.
 * Uses ADMIN_PASSWORD as the base for the HMAC key.
 */
function getSigningKey(): Buffer {
  const password = getAdminPassword();
  // Derive a signing key from the password
  return createHmac("sha256", "beef-with-bezos-signing-key")
    .update(password)
    .digest();
}

/**
 * Create a signed session token.
 * Format: timestamp.signature
 */
function createSessionToken(): string {
  const timestamp = Date.now().toString();
  const signature = createHmac("sha256", getSigningKey())
    .update(timestamp)
    .digest("hex");
  return `${timestamp}.${signature}`;
}

/**
 * Verify a session token is valid and not expired.
 */
function verifySessionToken(token: string): boolean {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return false;

    const [timestamp, providedSignature] = parts;
    const expectedSignature = createHmac("sha256", getSigningKey())
      .update(timestamp)
      .digest("hex");

    // Constant-time comparison for the signature
    const providedBuffer = Buffer.from(providedSignature, "hex");
    const expectedBuffer = Buffer.from(expectedSignature, "hex");

    if (providedBuffer.length !== expectedBuffer.length) return false;

    const signatureValid = timingSafeEqual(providedBuffer, expectedBuffer);
    if (!signatureValid) return false;

    // Check if token is expired (30 days)
    const tokenTime = parseInt(timestamp, 10);
    const now = Date.now();
    const maxAge = COOKIE_MAX_AGE * 1000; // Convert to milliseconds

    return now - tokenTime < maxAge;
  } catch {
    return false;
  }
}

/**
 * Verify password using constant-time comparison to prevent timing attacks.
 */
export async function verifyPassword(password: string): Promise<boolean> {
  const adminPassword = getAdminPassword();

  // Ensure both strings are the same length for timingSafeEqual
  const passwordBuffer = Buffer.from(password);
  const adminPasswordBuffer = Buffer.from(adminPassword);

  // If lengths differ, we still do a comparison to prevent timing leaks
  if (passwordBuffer.length !== adminPasswordBuffer.length) {
    // Compare against a dummy to maintain constant time
    const dummy = Buffer.alloc(passwordBuffer.length);
    timingSafeEqual(passwordBuffer, dummy);
    return false;
  }

  return timingSafeEqual(passwordBuffer, adminPasswordBuffer);
}

/**
 * Set a signed authentication cookie.
 */
export async function setAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  const token = createSessionToken();

  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
}

/**
 * Clear the authentication cookie.
 */
export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}

/**
 * Check if the current request has a valid authentication cookie.
 */
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(AUTH_COOKIE_NAME);

  if (!authCookie?.value) return false;

  return verifySessionToken(authCookie.value);
}
