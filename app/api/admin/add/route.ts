import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthenticated } from "@/lib/auth";
import { addMiss, getMissCount } from "@/lib/kv";
import { validateMissInput, MAX_RECORDS } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const authenticated = await isAuthenticated();

    if (!authenticated) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check record limit before adding
    const currentCount = await getMissCount();
    if (currentCount >= MAX_RECORDS) {
      return NextResponse.json(
        { error: `Maximum record limit (${MAX_RECORDS}) reached. Delete some records first.` },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validation = validateMissInput(body);

    if (!validation.valid || !validation.data) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    const { date, note } = validation.data;
    const missedDelivery = await addMiss(date, note);

    // Bust the cache so the new miss shows immediately
    revalidatePath("/");

    return NextResponse.json({ success: true, miss: missedDelivery });
  } catch (error) {
    console.error("Add miss error:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json(
      { error: "Failed to add missed delivery" },
      { status: 500 }
    );
  }
}
