import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/admin/add/route";

// Mock dependencies
vi.mock("@/lib/auth", () => ({
  isAuthenticated: vi.fn(),
}));

vi.mock("@/lib/kv", () => ({
  addMiss: vi.fn(),
  getMissCount: vi.fn(),
}));

import { isAuthenticated } from "@/lib/auth";
import { addMiss, getMissCount } from "@/lib/kv";

describe("POST /api/admin/add", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getMissCount).mockResolvedValue(0);
  });

  it("returns 401 when not authenticated", async () => {
    vi.mocked(isAuthenticated).mockResolvedValue(false);

    const request = new Request("http://localhost/api/admin/add", {
      method: "POST",
      body: JSON.stringify({ date: "2024-01-15", note: "Test" }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Unauthorized");
  });

  it("creates miss with valid input", async () => {
    vi.mocked(isAuthenticated).mockResolvedValue(true);
    vi.mocked(addMiss).mockResolvedValue({
      id: "abc123defg",
      date: "2024-01-15",
      note: "Test note",
      createdAt: 1234567890,
    });

    const request = new Request("http://localhost/api/admin/add", {
      method: "POST",
      body: JSON.stringify({ date: "2024-01-15", note: "Test note" }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.miss.id).toBe("abc123defg");
    expect(addMiss).toHaveBeenCalledWith("2024-01-15", "Test note");
  });

  it("returns 400 for invalid date", async () => {
    vi.mocked(isAuthenticated).mockResolvedValue(true);

    const request = new Request("http://localhost/api/admin/add", {
      method: "POST",
      body: JSON.stringify({ date: "invalid-date", note: "Test" }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain("Invalid date format");
  });

  it("returns 400 for future date", async () => {
    vi.mocked(isAuthenticated).mockResolvedValue(true);

    const future = new Date();
    future.setFullYear(future.getFullYear() + 1);
    const futureDate = future.toISOString().split("T")[0];

    const request = new Request("http://localhost/api/admin/add", {
      method: "POST",
      body: JSON.stringify({ date: futureDate, note: "Test" }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain("future");
  });

  it("returns 400 when max records reached", async () => {
    vi.mocked(isAuthenticated).mockResolvedValue(true);
    vi.mocked(getMissCount).mockResolvedValue(1000);

    const request = new Request("http://localhost/api/admin/add", {
      method: "POST",
      body: JSON.stringify({ date: "2024-01-15", note: "Test" }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain("Maximum record limit");
  });

  it("accepts empty note", async () => {
    vi.mocked(isAuthenticated).mockResolvedValue(true);
    vi.mocked(addMiss).mockResolvedValue({
      id: "abc123defg",
      date: "2024-01-15",
      note: "",
      createdAt: 1234567890,
    });

    const request = new Request("http://localhost/api/admin/add", {
      method: "POST",
      body: JSON.stringify({ date: "2024-01-15" }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });
});
