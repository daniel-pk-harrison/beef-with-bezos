import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { deleteMiss } from "@/lib/kv";

export async function POST(request: Request) {
  try {
    const authenticated = await isAuthenticated();

    if (!authenticated) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await request.json();

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { error: "ID is required" },
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete miss error:", error);
    return NextResponse.json(
      { error: "Failed to delete missed delivery" },
      { status: 500 }
    );
  }
}
