import type { KVStore } from "./interface";

interface StoredValue {
  value: unknown;
  expiresAt?: number;
}

/**
 * In-memory KV store for local development
 */
class MemoryKVStore implements KVStore {
  private store = new Map<string, StoredValue>();

  async get<T>(key: string): Promise<T | null> {
    const stored = this.store.get(key);
    if (!stored) return null;

    // Check expiration
    if (stored.expiresAt && Date.now() > stored.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return stored.value as T;
  }

  async set<T>(key: string, value: T): Promise<void> {
    this.store.set(key, { value });
  }

  async del(key: string): Promise<void> {
    this.store.delete(key);
  }

  async setNX(key: string, value: unknown, ttlMs: number): Promise<boolean> {
    const existing = await this.get(key);
    if (existing !== null) return false;

    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttlMs,
    });
    return true;
  }
}

// Singleton instance
export const memoryKV = new MemoryKVStore();
