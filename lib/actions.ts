"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import {
  isAuthenticated,
  verifyPassword,
  setAuthCookie,
  clearAuthCookie,
} from "./auth";
import { getMisses, addMiss, deleteMiss } from "./kv";
import { validateMissInput, isValidId, MAX_RECORDS } from "./validation";
import { checkRateLimit, resetRateLimit } from "./rate-limit";
import type { MissedDelivery } from "@/types";

/**
 * Type-safe action result pattern
 */
export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * Helper to create error logging message
 */
function formatError(error: unknown): string {
  return error instanceof Error ? error.message : "Unknown error";
}

/**
 * Get client identifier from headers for rate limiting
 */
async function getClientId(): Promise<string> {
  const headersList = await headers();
  const forwarded = headersList.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = headersList.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "localhost";
}

// ============================================================================
// Data Actions
// ============================================================================

/**
 * Fetch all missed deliveries
 */
export async function getMissesAction(): Promise<ActionResult<MissedDelivery[]>> {
  try {
    const misses = await getMisses();
    return { success: true, data: misses };
  } catch (error) {
    console.error("getMissesAction error:", formatError(error));
    return { success: false, error: "Failed to fetch missed deliveries" };
  }
}

/**
 * Add a new missed delivery (requires authentication)
 */
export async function addMissAction(
  date: string,
  note: string
): Promise<ActionResult<MissedDelivery>> {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return { success: false, error: "Unauthorized" };
    }

    const validation = validateMissInput({ date, note });
    if (!validation.valid || !validation.data) {
      return { success: false, error: validation.error || "Invalid input" };
    }

    const misses = await getMisses();
    if (misses.length >= MAX_RECORDS) {
      return {
        success: false,
        error: `Maximum record limit (${MAX_RECORDS}) reached. Delete some records first.`,
      };
    }

    const miss = await addMiss(validation.data.date, validation.data.note);
    revalidatePath("/");
    return { success: true, data: miss };
  } catch (error) {
    console.error("addMissAction error:", formatError(error));
    return { success: false, error: "Failed to add missed delivery" };
  }
}

/**
 * Delete a missed delivery (requires authentication)
 */
export async function deleteMissAction(id: string): Promise<ActionResult> {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return { success: false, error: "Unauthorized" };
    }

    if (!isValidId(id)) {
      return { success: false, error: "Invalid ID format" };
    }

    const deleted = await deleteMiss(id);
    if (!deleted) {
      return { success: false, error: "Record not found" };
    }

    revalidatePath("/");
    return { success: true, data: undefined };
  } catch (error) {
    console.error("deleteMissAction error:", formatError(error));
    return { success: false, error: "Failed to delete missed delivery" };
  }
}

// ============================================================================
// Auth Actions
// ============================================================================

/**
 * Check if user is authenticated
 */
export async function checkAuthAction(): Promise<ActionResult<boolean>> {
  try {
    const authenticated = await isAuthenticated();
    return { success: true, data: authenticated };
  } catch (error) {
    console.error("checkAuthAction error:", formatError(error));
    return { success: true, data: false };
  }
}

export interface LoginResult {
  authenticated: boolean;
  remaining?: number;
  resetIn?: number;
}

/**
 * Login with password (includes rate limiting)
 */
export async function loginAction(
  password: string
): Promise<ActionResult<LoginResult>> {
  try {
    const clientId = await getClientId();
    const rateLimit = await checkRateLimit(clientId);

    if (!rateLimit.allowed) {
      return {
        success: false,
        error: `Too many login attempts. Try again in ${Math.ceil(rateLimit.resetIn / 60)} minutes.`,
      };
    }

    if (!password || typeof password !== "string") {
      return { success: false, error: "Password is required" };
    }

    if (password.length > 128) {
      return { success: false, error: "Invalid password" };
    }

    const isValid = await verifyPassword(password);

    if (!isValid) {
      return {
        success: true,
        data: {
          authenticated: false,
          remaining: rateLimit.remaining,
        },
      };
    }

    await resetRateLimit(clientId);
    await setAuthCookie();

    return {
      success: true,
      data: { authenticated: true },
    };
  } catch (error) {
    console.error("loginAction error:", formatError(error));
    return { success: false, error: "Login failed" };
  }
}

/**
 * Logout current user
 */
export async function logoutAction(): Promise<ActionResult> {
  try {
    await clearAuthCookie();
    return { success: true, data: undefined };
  } catch (error) {
    console.error("logoutAction error:", formatError(error));
    return { success: false, error: "Logout failed" };
  }
}
