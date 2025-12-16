import type { KVStore } from "./interface";
import { memoryKV } from "./memory";
import { getUpstashKV } from "./upstash";

export type { KVStore } from "./interface";

/**
 * Check if Upstash Redis is configured
 */
export function isKVConfigured(): boolean {
  return !!(
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
}

/**
 * Get the configured KV store instance
 *
 * Returns Upstash Redis in production (when env vars are set),
 * or in-memory store for local development.
 *
 * To add a new provider:
 * 1. Create a new file implementing KVStore interface
 * 2. Add a check here to return it based on env vars
 */
export function getKV(): KVStore {
  if (isKVConfigured()) {
    return getUpstashKV();
  }
  return memoryKV;
}
