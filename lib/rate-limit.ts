/**
 * In-memory rate limiter for login attempts.
 *
 * LIMITATION: In serverless environments (Vercel), each function instance has its own
 * memory. This means rate limits are per-instance, not global. An attacker could
 * potentially bypass rate limiting by getting routed to different instances.
 *
 * For this app, this is acceptable because:
 * 1. Vercel tends to reuse warm instances, so most requests hit the same instance
 * 2. The admin password should be strong (12+ chars recommended)
 * 3. The attack surface is limited (only /api/admin/login endpoint)
 */

// Configuration
const MAX_ATTEMPTS = 5; // Maximum login attempts
const WINDOW_MS = 15 * 60 * 1000; // 15 minute window
const LOCKOUT_MS = 30 * 60 * 1000; // 30 minute lockout after max attempts

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store (per serverless instance)
const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Clean up expired entries periodically to prevent memory leaks.
 */
function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

// Run cleanup every 5 minutes (only in long-running processes)
if (typeof setInterval !== "undefined") {
  setInterval(cleanupExpiredEntries, 5 * 60 * 1000);
}

/**
 * Extract client identifier from request.
 * Uses X-Forwarded-For header (set by Vercel/proxies) or falls back to a default.
 */
export function getClientIdentifier(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    // Take the first IP in the chain (original client)
    return forwarded.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }

  // Fallback for local development
  return "localhost";
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetIn: number; // seconds until reset
}

/**
 * Check if a login attempt is allowed for the given identifier.
 */
export async function checkRateLimit(identifier: string): Promise<RateLimitResult> {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  // No existing entry - allow and create
  if (!entry) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + WINDOW_MS,
    });
    return {
      allowed: true,
      remaining: MAX_ATTEMPTS - 1,
      resetIn: Math.ceil(WINDOW_MS / 1000),
    };
  }

  // Entry expired - reset and allow
  if (now > entry.resetTime) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + WINDOW_MS,
    });
    return {
      allowed: true,
      remaining: MAX_ATTEMPTS - 1,
      resetIn: Math.ceil(WINDOW_MS / 1000),
    };
  }

  // Check if locked out (exceeded max attempts)
  if (entry.count >= MAX_ATTEMPTS) {
    const resetIn = Math.ceil((entry.resetTime - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      resetIn,
    };
  }

  // Increment count and allow
  entry.count++;

  // If this attempt hits the limit, extend the lockout period
  if (entry.count >= MAX_ATTEMPTS) {
    entry.resetTime = now + LOCKOUT_MS;
  }

  rateLimitStore.set(identifier, entry);

  return {
    allowed: true,
    remaining: MAX_ATTEMPTS - entry.count,
    resetIn: Math.ceil((entry.resetTime - now) / 1000),
  };
}

/**
 * Reset rate limit for an identifier (e.g., after successful login).
 */
export async function resetRateLimit(identifier: string): Promise<void> {
  rateLimitStore.delete(identifier);
}
