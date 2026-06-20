import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "../../../../src/lib/firebase-admin";
import { csrfCheck, securityHeaders } from "../../../../src/lib/auth-middleware";

// Simple in-memory rate limiter (use Redis in production with multiple instances)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function getClientIp(request: NextRequest): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const xri = request.headers.get("x-real-ip");
  if (xri) return xri;
  return "unknown";
}

function checkRateLimit(identifier: string): { allowed: boolean; remaining: number; retryAfter?: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(identifier, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_ATTEMPTS - 1 };
  }

  if (entry.count >= MAX_ATTEMPTS) {
    return { allowed: false, remaining: 0, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }

  entry.count++;
  return { allowed: true, remaining: MAX_ATTEMPTS - entry.count };
}

export async function POST(request: NextRequest) {
  const clientIp = getClientIp(request);

  // Rate limiting check
  const rateLimit = checkRateLimit(clientIp);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { success: false, error: "Too many login attempts. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimit.retryAfter),
          "X-RateLimit-Limit": String(MAX_ATTEMPTS),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(Math.ceil(Date.now() / 1000) + (rateLimit.retryAfter || 0)),
        },
      }
    );
  }

  try {
    if (!csrfCheck(request)) {
      return NextResponse.json(
        { success: false, error: "Invalid request origin" },
        { status: 403 }
      );
    }

    const { email, password } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { success: false, error: "Password is required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Enforce max password length to prevent abuse
    if (password.length > 128) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "Firebase API key not configured" },
        { status: 500 }
      );
    }

    // Sign in with email/password using Firebase REST API
    const signInRes = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
          returnSecureToken: true,
        }),
      }
    );

    const signInData = await signInRes.json();

    if (signInData.error || !signInData.idToken) {
      console.error("signInWithPassword error:", signInData.error);
      const errorMessage = signInData.error?.message === "INVALID_PASSWORD"
        ? "Invalid password"
        : signInData.error?.message === "EMAIL_NOT_FOUND"
        ? "No account found with this email"
        : "Invalid email or password";
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 401 }
      );
    }

    const idToken = signInData.idToken;

    // Verify the ID token with Admin SDK
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userRecord = await adminAuth.getUser(decodedToken.uid);

    // Create a session cookie
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: 60 * 60 * 24 * 5 * 1000, // 5 days
    });

    const response = securityHeaders(
      NextResponse.json({
        success: true,
        message: "Signed in successfully",
        user: {
          uid: userRecord.uid,
          email: userRecord.email,
        },
      })
    );

    // Set rate limit headers on success
    response.headers.set("X-RateLimit-Limit", String(MAX_ATTEMPTS));
    response.headers.set("X-RateLimit-Remaining", String(rateLimit.remaining));

    response.cookies.set("__session", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 5,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to sign in" },
      { status: 500 }
    );
  }
}
