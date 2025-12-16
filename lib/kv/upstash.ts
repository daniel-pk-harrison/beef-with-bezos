import { Redis } from "@upstash/redis";
import type { KVStore } from "./interface";

/**
 * Upstash Redis KV store implementation
 */
class UpstashKVStore implements KVStore {
  private client: Redis;

  constructor() {
    this.client = new Redis({
      url: process.env.KV_REST_API_URL!,
      token: process.env.KV_REST_API_TOKEN!,
    });
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.client.get<T>(key);
    return value ?? null;
  }

  async set<T>(key: string, value: T): Promise<void> {
    await this.client.set(key, value);
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async setNX(key: string, value: unknown, ttlMs: number): Promise<boolean> {
    // NX = only set if not exists, PX = expire in milliseconds
    const result = await this.client.set(key, value, { nx: true, px: ttlMs });
    return result === "OK";
  }
}

// Lazy singleton - only created when first accessed
let instance: UpstashKVStore | null = null;

export function getUpstashKV(): KVStore {
  if (!instance) {
    instance = new UpstashKVStore();
  }
  return instance;
}
