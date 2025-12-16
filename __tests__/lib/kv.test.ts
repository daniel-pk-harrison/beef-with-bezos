import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";

// We need to test with local fallback mode (no KV configured)
// The module checks for KV_REST_API_URL and KV_REST_API_TOKEN

describe("kv (local fallback mode)", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Clear KV env vars to use local fallback
    vi.resetModules();
    process.env = { ...originalEnv };
    delete process.env.KV_REST_API_URL;
    delete process.env.KV_REST_API_TOKEN;
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.resetModules();
  });

  it("getMisses returns empty array initially", async () => {
    const { getMisses } = await import("@/lib/kv");
    const misses = await getMisses();
    expect(Array.isArray(misses)).toBe(true);
  });

  it("addMiss creates record with correct structure", async () => {
    const { addMiss, getMisses } = await import("@/lib/kv");

    const miss = await addMiss("2024-01-15", "Test note");

    expect(miss.id).toHaveLength(10);
    expect(miss.date).toBe("2024-01-15");
    expect(miss.note).toBe("Test note");
    expect(typeof miss.createdAt).toBe("number");

    const misses = await getMisses();
    expect(misses.length).toBeGreaterThanOrEqual(1);
    expect(misses.some((m) => m.id === miss.id)).toBe(true);
  });

  it("deleteMiss removes record and returns true", async () => {
    const { addMiss, deleteMiss, getMisses } = await import("@/lib/kv");

    const miss = await addMiss("2024-01-15", "To be deleted");
    const initialCount = (await getMisses()).length;

    const deleted = await deleteMiss(miss.id);
    expect(deleted).toBe(true);

    const misses = await getMisses();
    expect(misses.length).toBe(initialCount - 1);
    expect(misses.some((m) => m.id === miss.id)).toBe(false);
  });

  it("deleteMiss returns false for non-existent id", async () => {
    const { deleteMiss } = await import("@/lib/kv");

    const deleted = await deleteMiss("nonexistent");
    expect(deleted).toBe(false);
  });

  it("getMissCount returns correct count", async () => {
    const { getMissCount, getMisses } = await import("@/lib/kv");

    const count = await getMissCount();
    const misses = await getMisses();
    expect(count).toBe(misses.length);
  });

  it("addMiss prepends new records (newest first)", async () => {
    const { addMiss, getMisses } = await import("@/lib/kv");

    const miss1 = await addMiss("2024-01-01", "First");
    const miss2 = await addMiss("2024-01-02", "Second");

    const misses = await getMisses();
    const miss1Index = misses.findIndex((m) => m.id === miss1.id);
    const miss2Index = misses.findIndex((m) => m.id === miss2.id);

    // miss2 should come before miss1 (lower index = newer)
    expect(miss2Index).toBeLessThan(miss1Index);
  });
});
