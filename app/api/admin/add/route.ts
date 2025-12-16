import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { addMiss } from "@/lib/kv";

export async function POST(request: Request) {
  try {
    const authenticated = await isAuthenticated();

    if (!authenticated) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { date, note } = await request.json();

    if (!date || typeof date !== "string") {
      return NextResponse.json(
        { error: "Date is required" },
        { status: 400 }
      );
    }

    const missedDelivery = await addMiss(date, note ?? "");
    return NextResponse.json({ success: true, miss: missedDelivery });
  } catch (error) {
    console.error("Add miss error:", error);
    return NextResponse.json(
      { error: "Failed to add missed delivery" },
      { status: 500 }
    );
  }
}
