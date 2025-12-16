import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "@/app/api/health/route";

// Mock the kv module
vi.mock("@/lib/kv", () => ({
  getMissCount: vi.fn(),
}));

import { getMissCount } from "@/lib/kv";

describe("GET /api/health", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns healthy status on success", async () => {
    vi.mocked(getMissCount).mockResolvedValue(5);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.status).toBe("healthy");
    expect(data.checks.database.status).toBe("connected");
    expect(data.checks.database.records).toBe(5);
    expect(data.checks.database.latency).toMatch(/^\d+ms$/);
    expect(data.timestamp).toBeDefined();
  });

  it("returns unhealthy status on database error", async () => {
    vi.mocked(getMissCount).mockRejectedValue(new Error("Connection failed"));

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(503);
    expect(data.status).toBe("unhealthy");
    expect(data.checks.database.status).toBe("error");
    expect(data.checks.database.message).toBe("Database connection failed");
  });
});
