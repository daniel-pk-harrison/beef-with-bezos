import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/admin/delete/route";

// Mock dependencies
vi.mock("@/lib/auth", () => ({
  isAuthenticated: vi.fn(),
}));

vi.mock("@/lib/kv", () => ({
  deleteMiss: vi.fn(),
}));

import { isAuthenticated } from "@/lib/auth";
import { deleteMiss } from "@/lib/kv";

describe("POST /api/admin/delete", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when not authenticated", async () => {
    vi.mocked(isAuthenticated).mockResolvedValue(false);

    const request = new Request("http://localhost/api/admin/delete", {
      method: "POST",
      body: JSON.stringify({ id: "abc123defg" }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Unauthorized");
  });

  it("deletes miss with valid id", async () => {
    vi.mocked(isAuthenticated).mockResolvedValue(true);
    vi.mocked(deleteMiss).mockResolvedValue(true);

    const request = new Request("http://localhost/api/admin/delete", {
      method: "POST",
      body: JSON.stringify({ id: "abc123defg" }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(deleteMiss).toHaveBeenCalledWith("abc123defg");
  });

  it("returns 404 when miss not found", async () => {
    vi.mocked(isAuthenticated).mockResolvedValue(true);
    vi.mocked(deleteMiss).mockResolvedValue(false);

    const request = new Request("http://localhost/api/admin/delete", {
      method: "POST",
      body: JSON.stringify({ id: "abc123defg" }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe("Miss not found");
  });

  it("returns 400 for invalid id format", async () => {
    vi.mocked(isAuthenticated).mockResolvedValue(true);

    const request = new Request("http://localhost/api/admin/delete", {
      method: "POST",
      body: JSON.stringify({ id: "short" }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid ID format");
  });

  it("returns 400 for missing id", async () => {
    vi.mocked(isAuthenticated).mockResolvedValue(true);

    const request = new Request("http://localhost/api/admin/delete", {
      method: "POST",
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid ID format");
  });
});
