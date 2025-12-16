import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  getClientIdentifier,
  checkRateLimit,
  resetRateLimit,
} from "@/lib/rate-limit";

describe("getClientIdentifier", () => {
  it("extracts IP from X-Forwarded-For header", () => {
    const request = new Request("http://localhost", {
      headers: { "x-forwarded-for": "192.168.1.1, 10.0.0.1" },
    });
    expect(getClientIdentifier(request)).toBe("192.168.1.1");
  });

  it("extracts IP from X-Forwarded-For with whitespace", () => {
    const request = new Request("http://localhost", {
      headers: { "x-forwarded-for": "  192.168.1.1  ,10.0.0.1" },
    });
    expect(getClientIdentifier(request)).toBe("192.168.1.1");
  });

  it("falls back to X-Real-IP if X-Forwarded-For not present", () => {
    const request = new Request("http://localhost", {
      headers: { "x-real-ip": "192.168.1.2" },
    });
    expect(getClientIdentifier(request)).toBe("192.168.1.2");
  });

  it("trims X-Real-IP", () => {
    const request = new Request("http://localhost", {
      headers: { "x-real-ip": "  192.168.1.2  " },
    });
    expect(getClientIdentifier(request)).toBe("192.168.1.2");
  });

  it("returns localhost when no headers present", () => {
    const request = new Request("http://localhost");
    expect(getClientIdentifier(request)).toBe("localhost");
  });
});

describe("checkRateLimit", () => {
  beforeEach(async () => {
    // Reset any existing rate limits
    await resetRateLimit("test-client");
    await resetRateLimit("lockout-test");
  });

  it("allows first request", async () => {
    const result = await checkRateLimit("test-client-1");
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(4); // 5 max - 1 used
  });

  it("tracks multiple requests", async () => {
    const id = "test-client-2";
    await resetRateLimit(id);

    const r1 = await checkRateLimit(id);
    expect(r1.remaining).toBe(4);

    const r2 = await checkRateLimit(id);
    expect(r2.remaining).toBe(3);

    const r3 = await checkRateLimit(id);
    expect(r3.remaining).toBe(2);
  });

  it("blocks after max attempts", async () => {
    const id = "lockout-test-1";
    await resetRateLimit(id);

    // Use up all attempts
    for (let i = 0; i < 5; i++) {
      await checkRateLimit(id);
    }

    // Next request should be blocked
    const blocked = await checkRateLimit(id);
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
  });

  it("returns reset time in seconds", async () => {
    const id = "reset-time-test";
    await resetRateLimit(id);

    const result = await checkRateLimit(id);
    expect(result.resetIn).toBeGreaterThan(0);
    expect(result.resetIn).toBeLessThanOrEqual(15 * 60); // 15 minutes
  });
});

describe("resetRateLimit", () => {
  it("clears rate limit for identifier", async () => {
    const id = "reset-test";

    // Make some requests
    await checkRateLimit(id);
    await checkRateLimit(id);
    await checkRateLimit(id);

    // Reset
    await resetRateLimit(id);

    // Should have full attempts again
    const result = await checkRateLimit(id);
    expect(result.remaining).toBe(4); // Fresh start
  });

  it("does not affect other identifiers", async () => {
    const id1 = "reset-test-1";
    const id2 = "reset-test-2";

    await resetRateLimit(id1);
    await resetRateLimit(id2);

    // Make requests on id1
    await checkRateLimit(id1);
    await checkRateLimit(id1);

    // Reset id2
    await resetRateLimit(id2);

    // id1 should still have reduced attempts
    const result = await checkRateLimit(id1);
    expect(result.remaining).toBe(2);
  });
});
