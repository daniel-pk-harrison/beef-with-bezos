import { nanoid } from "nanoid";
import type { MissedDelivery } from "@/types";
import { MAX_RECORDS } from "./validation";
import { getKV, isKVConfigured } from "./kv/index";

const MISSES_KEY = "misses";
const LOCK_KEY = "misses_lock";
const LOCK_TIMEOUT = 5000; // 5 seconds

/**
 * Acquire a simple distributed lock using KV.
 * Returns true if lock acquired, false otherwise.
 */
async function acquireLock(): Promise<boolean> {
  if (!isKVConfigured()) return true; // No lock needed for local

  try {
    return await getKV().setNX(LOCK_KEY, Date.now(), LOCK_TIMEOUT);
  } catch {
    return false;
  }
}

/**
 * Release the distributed lock.
 */
async function releaseLock(): Promise<void> {
  if (!isKVConfigured()) return;

  try {
    await getKV().del(LOCK_KEY);
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
  try {
    const misses = await getKV().get<MissedDelivery[]>(MISSES_KEY);
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

  return withLock(async () => {
    const misses = await getMisses();

    // Enforce max records
    if (misses.length >= MAX_RECORDS) {
      throw new Error(`Maximum record limit (${MAX_RECORDS}) reached`);
    }

    const updated = [newMiss, ...misses];
    await getKV().set(MISSES_KEY, updated);
    return newMiss;
  });
}

export async function deleteMiss(id: string): Promise<boolean> {
  return withLock(async () => {
    const misses = await getMisses();
    const filtered = misses.filter((m) => m.id !== id);

    if (filtered.length === misses.length) {
      return false; // Nothing was deleted
    }

    await getKV().set(MISSES_KEY, filtered);
    return true;
  });
}

export async function getMissCount(): Promise<number> {
  const misses = await getMisses();
  return misses.length;
}
