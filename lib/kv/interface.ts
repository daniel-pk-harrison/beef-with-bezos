/**
 * KV Store Interface - Abstraction layer for key-value storage
 *
 * Implement this interface to add support for different KV providers
 * (Upstash, Redis, DynamoDB, etc.)
 */
export interface KVStore {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  del(key: string): Promise<void>;

  /**
   * Set a key only if it doesn't exist (for distributed locks)
   * Returns true if the key was set, false if it already existed
   */
  setNX(key: string, value: unknown, ttlMs: number): Promise<boolean>;
}
