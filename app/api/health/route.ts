import { NextResponse } from "next/server";
import { getMissCount } from "@/lib/kv";

export const dynamic = "force-dynamic";

export async function GET() {
  const startTime = Date.now();

  try {
    // Check KV connectivity by getting count
    const count = await getMissCount();
    const latency = Date.now() - startTime;

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      checks: {
        database: {
          status: "connected",
          latency: `${latency}ms`,
          records: count,
        },
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        checks: {
          database: {
            status: "error",
            message: "Database connection failed",
          },
        },
      },
      { status: 503 }
    );
  }
}
