import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "@/app/api/misses/route";

// Mock the kv module
vi.mock("@/lib/kv", () => ({
  getMisses: vi.fn(),
}));

import { getMisses } from "@/lib/kv";

describe("GET /api/misses", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns misses and count on success", async () => {
    const mockMisses = [
      { id: "abc123defg", date: "2024-01-15", note: "Test", createdAt: 1234567890 },
      { id: "xyz789hijk", date: "2024-01-16", note: "Test 2", createdAt: 1234567891 },
    ];

    vi.mocked(getMisses).mockResolvedValue(mockMisses);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.misses).toEqual(mockMisses);
    expect(data.count).toBe(2);
  });

  it("returns empty array when no misses", async () => {
    vi.mocked(getMisses).mockResolvedValue([]);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.misses).toEqual([]);
    expect(data.count).toBe(0);
  });

  it("returns 500 on error", async () => {
    vi.mocked(getMisses).mockRejectedValue(new Error("Database error"));

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Failed to fetch misses");
  });
});
