import { NextResponse } from "next/server";
import { verifyPassword, setAuthCookie } from "@/lib/auth";
import {
  checkRateLimit,
  resetRateLimit,
  getClientIdentifier,
} from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    // Check rate limit
    const clientId = getClientIdentifier(request);
    const rateLimit = await checkRateLimit(clientId);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: `Too many login attempts. Try again in ${Math.ceil(rateLimit.resetIn / 60)} minutes.`,
        },
        {
          status: 429,
          headers: {
            "Retry-After": rateLimit.resetIn.toString(),
          },
        }
      );
    }

    const body = await request.json();
    const { password } = body;

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    // Limit password length to prevent DoS via long strings
    if (password.length > 128) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password);

    if (!isValid) {
      return NextResponse.json(
        {
          error: "Invalid password",
          remaining: rateLimit.remaining,
        },
        { status: 401 }
      );
    }

    // Successful login - reset rate limit and set cookie
    await resetRateLimit(clientId);
    await setAuthCookie();

    return NextResponse.json({ success: true });
  } catch (error) {
    // Log error securely (don't expose details to client)
    console.error("Login error:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}
