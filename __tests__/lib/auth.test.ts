import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { verifyPassword, getAdminPassword } from "@/lib/auth";

describe("getAdminPassword", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("returns ADMIN_PASSWORD from env when set", () => {
    process.env.ADMIN_PASSWORD = "mysecretpassword";
    expect(getAdminPassword()).toBe("mysecretpassword");
  });

  it("returns default password in development when not set", () => {
    delete process.env.ADMIN_PASSWORD;
    vi.stubEnv("NODE_ENV", "development");
    expect(getAdminPassword()).toBe("bezos123");
    vi.unstubAllEnvs();
  });

  it("throws in production when ADMIN_PASSWORD not set", () => {
    delete process.env.ADMIN_PASSWORD;
    vi.stubEnv("NODE_ENV", "production");
    expect(() => getAdminPassword()).toThrow(
      "ADMIN_PASSWORD environment variable is required in production"
    );
    vi.unstubAllEnvs();
  });
});

describe("verifyPassword", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
    process.env.ADMIN_PASSWORD = "testpassword123";
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("returns true for correct password", async () => {
    const result = await verifyPassword("testpassword123");
    expect(result).toBe(true);
  });

  it("returns false for incorrect password", async () => {
    const result = await verifyPassword("wrongpassword");
    expect(result).toBe(false);
  });

  it("returns false for empty password", async () => {
    const result = await verifyPassword("");
    expect(result).toBe(false);
  });

  it("returns false for password with different length", async () => {
    const result = await verifyPassword("short");
    expect(result).toBe(false);
  });

  it("handles unicode passwords", async () => {
    process.env.ADMIN_PASSWORD = "p@ssw0rd!";
    const result = await verifyPassword("p@ssw0rd!");
    expect(result).toBe(true);
  });
});
