/**
 * Simple in-memory rate limiter for login attempts.
 * In production with multiple instances, consider using Vercel KV for distributed rate limiting.
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// Store rate limit data in memory
const rateLimitStore = new Map<string, RateLimitEntry>();

// Configuration
const MAX_ATTEMPTS = 5; // Maximum login attempts
const WINDOW_MS = 15 * 60 * 1000; // 15 minute window
const LOCKOUT_MS = 30 * 60 * 1000; // 30 minute lockout after max attempts

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

// Run cleanup every 5 minutes
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
export function checkRateLimit(identifier: string): RateLimitResult {
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
export function resetRateLimit(identifier: string): void {
  rateLimitStore.delete(identifier);
}
