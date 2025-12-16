import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/admin/login/route";

// Mock dependencies
vi.mock("@/lib/auth", () => ({
  verifyPassword: vi.fn(),
  setAuthCookie: vi.fn(),
}));

vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: vi.fn(),
  resetRateLimit: vi.fn(),
  getClientIdentifier: vi.fn(),
}));

import { verifyPassword, setAuthCookie } from "@/lib/auth";
import { checkRateLimit, resetRateLimit, getClientIdentifier } from "@/lib/rate-limit";

describe("POST /api/admin/login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getClientIdentifier).mockReturnValue("test-client");
    vi.mocked(checkRateLimit).mockResolvedValue({
      allowed: true,
      remaining: 4,
      resetIn: 900,
    });
  });

  it("returns success with valid password", async () => {
    vi.mocked(verifyPassword).mockResolvedValue(true);

    const request = new Request("http://localhost/api/admin/login", {
      method: "POST",
      body: JSON.stringify({ password: "correctpassword" }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(setAuthCookie).toHaveBeenCalled();
    expect(resetRateLimit).toHaveBeenCalledWith("test-client");
  });

  it("returns 401 with invalid password", async () => {
    vi.mocked(verifyPassword).mockResolvedValue(false);

    const request = new Request("http://localhost/api/admin/login", {
      method: "POST",
      body: JSON.stringify({ password: "wrongpassword" }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Invalid password");
    expect(setAuthCookie).not.toHaveBeenCalled();
  });

  it("returns 400 when password is missing", async () => {
    const request = new Request("http://localhost/api/admin/login", {
      method: "POST",
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Password is required");
  });

  it("returns 429 when rate limited", async () => {
    vi.mocked(checkRateLimit).mockResolvedValue({
      allowed: false,
      remaining: 0,
      resetIn: 1800,
    });

    const request = new Request("http://localhost/api/admin/login", {
      method: "POST",
      body: JSON.stringify({ password: "anypassword" }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(429);
    expect(data.error).toContain("Too many login attempts");
    expect(response.headers.get("Retry-After")).toBe("1800");
  });

  it("rejects password longer than 128 characters", async () => {
    const longPassword = "a".repeat(200);

    const request = new Request("http://localhost/api/admin/login", {
      method: "POST",
      body: JSON.stringify({ password: longPassword }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Invalid password");
    expect(verifyPassword).not.toHaveBeenCalled();
  });
});
