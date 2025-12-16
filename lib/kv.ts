import { kv } from "@vercel/kv";
import { nanoid } from "nanoid";
import type { MissedDelivery } from "@/types";
import { MAX_RECORDS } from "./validation";

const MISSES_KEY = "misses";
const LOCK_KEY = "misses_lock";
const LOCK_TIMEOUT = 5000; // 5 seconds

// In-memory fallback for local development
let localMisses: MissedDelivery[] = [];

function isKvConfigured(): boolean {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

/**
 * Acquire a simple distributed lock using KV.
 * Returns true if lock acquired, false otherwise.
 */
async function acquireLock(): Promise<boolean> {
  if (!isKvConfigured()) return true; // No lock needed for local

  try {
    // NX = only set if not exists, PX = expire in milliseconds
    const result = await kv.set(LOCK_KEY, Date.now(), { nx: true, px: LOCK_TIMEOUT });
    return result === "OK";
  } catch {
    return false;
  }
}

/**
 * Release the distributed lock.
 */
async function releaseLock(): Promise<void> {
  if (!isKvConfigured()) return;

  try {
    await kv.del(LOCK_KEY);
  } catch {
    // Ignore release errors - lock will expire anyway
  }
}

/**
 * Execute an operation with a distributed lock.
 * Retries up to 3 times if lock is not available.
 */
async function withLock<T>(operation: () => Promise<T>): Promise<T> {
  const maxRetries = 3;
  const retryDelay = 100; // ms

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    if (await acquireLock()) {
      try {
        return await operation();
      } finally {
        await releaseLock();
      }
    }

    // Wait before retrying
    await new Promise((resolve) => setTimeout(resolve, retryDelay * (attempt + 1)));
  }

  throw new Error("Could not acquire lock for KV operation");
}

export async function getMisses(): Promise<MissedDelivery[]> {
  if (!isKvConfigured()) {
    return localMisses;
  }

  try {
    const misses = await kv.get<MissedDelivery[]>(MISSES_KEY);
    return misses ?? [];
  } catch (error) {
    console.error("Failed to get misses from KV:", error instanceof Error ? error.message : "Unknown error");
    return [];
  }
}

export async function addMiss(
  date: string,
  note: string
): Promise<MissedDelivery> {
  const newMiss: MissedDelivery = {
    id: nanoid(10),
    date,
    note,
    createdAt: Date.now(),
  };

  if (!isKvConfigured()) {
    // Enforce max records for local storage too
    if (localMisses.length >= MAX_RECORDS) {
      throw new Error(`Maximum record limit (${MAX_RECORDS}) reached`);
    }
    localMisses = [newMiss, ...localMisses];
    return newMiss;
  }

  return withLock(async () => {
    const misses = await getMisses();

    // Enforce max records
    if (misses.length >= MAX_RECORDS) {
      throw new Error(`Maximum record limit (${MAX_RECORDS}) reached`);
    }

    const updated = [newMiss, ...misses];
    await kv.set(MISSES_KEY, updated);
    return newMiss;
  });
}

export async function deleteMiss(id: string): Promise<boolean> {
  if (!isKvConfigured()) {
    const before = localMisses.length;
    localMisses = localMisses.filter((m) => m.id !== id);
    return localMisses.length < before;
  }

  return withLock(async () => {
    const misses = await getMisses();
    const filtered = misses.filter((m) => m.id !== id);

    if (filtered.length === misses.length) {
      return false; // Nothing was deleted
    }

    await kv.set(MISSES_KEY, filtered);
    return true;
  });
}

export async function getMissCount(): Promise<number> {
  const misses = await getMisses();
  return misses.length;
}
