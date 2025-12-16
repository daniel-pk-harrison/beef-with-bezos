import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthenticated } from "@/lib/auth";
import { deleteMiss } from "@/lib/kv";
import { isValidId } from "@/lib/validation";

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

    const body = await request.json();
    const { id } = body;

    if (!isValidId(id)) {
      return NextResponse.json(
        { error: "Invalid ID format" },
        { status: 400 }
      );
    }

    const deleted = await deleteMiss(id);

    if (!deleted) {
      return NextResponse.json(
        { error: "Miss not found" },
        { status: 404 }
      );
    }

    revalidatePath("/");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete miss error:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json(
      { error: "Failed to delete missed delivery" },
      { status: 500 }
    );
  }
}
