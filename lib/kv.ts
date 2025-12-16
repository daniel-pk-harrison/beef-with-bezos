import { kv } from "@vercel/kv";
import { nanoid } from "nanoid";
import type { MissedDelivery } from "@/types";

const MISSES_KEY = "misses";

// In-memory fallback for local development
let localMisses: MissedDelivery[] = [];

function isKvConfigured(): boolean {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

export async function getMisses(): Promise<MissedDelivery[]> {
  if (!isKvConfigured()) {
    return localMisses;
  }

  try {
    const misses = await kv.get<MissedDelivery[]>(MISSES_KEY);
    return misses ?? [];
  } catch (error) {
    console.error("Failed to get misses from KV:", error);
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
    localMisses = [newMiss, ...localMisses];
    return newMiss;
  }

  try {
    const misses = await getMisses();
    const updated = [newMiss, ...misses];
    await kv.set(MISSES_KEY, updated);
    return newMiss;
  } catch (error) {
    console.error("Failed to add miss to KV:", error);
    throw new Error("Failed to save missed delivery");
  }
}

export async function deleteMiss(id: string): Promise<boolean> {
  if (!isKvConfigured()) {
    const before = localMisses.length;
    localMisses = localMisses.filter((m) => m.id !== id);
    return localMisses.length < before;
  }

  try {
    const misses = await getMisses();
    const filtered = misses.filter((m) => m.id !== id);

    if (filtered.length === misses.length) {
      return false; // Nothing was deleted
    }

    await kv.set(MISSES_KEY, filtered);
    return true;
  } catch (error) {
    console.error("Failed to delete miss from KV:", error);
    throw new Error("Failed to delete missed delivery");
  }
}

export async function getMissCount(): Promise<number> {
  const misses = await getMisses();
  return misses.length;
}
