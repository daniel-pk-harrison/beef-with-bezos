import { NextResponse } from "next/server";
import { getMisses } from "@/lib/kv";

export const revalidate = 60; // Cache for 60 seconds

export async function GET() {
  try {
    const misses = await getMisses();
    return NextResponse.json({ misses, count: misses.length });
  } catch (error) {
    console.error("Error fetching misses:", error);
    return NextResponse.json(
      { error: "Failed to fetch misses" },
      { status: 500 }
    );
  }
}
