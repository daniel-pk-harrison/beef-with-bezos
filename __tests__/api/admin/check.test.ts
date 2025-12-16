import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "@/app/api/admin/check/route";

// Mock auth
vi.mock("@/lib/auth", () => ({
  isAuthenticated: vi.fn(),
}));

import { isAuthenticated } from "@/lib/auth";

describe("GET /api/admin/check", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns authenticated: true when authenticated", async () => {
    vi.mocked(isAuthenticated).mockResolvedValue(true);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.authenticated).toBe(true);
  });

  it("returns authenticated: false when not authenticated", async () => {
    vi.mocked(isAuthenticated).mockResolvedValue(false);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.authenticated).toBe(false);
  });

  it("returns authenticated: false on error", async () => {
    vi.mocked(isAuthenticated).mockRejectedValue(new Error("Auth error"));

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.authenticated).toBe(false);
  });
});
