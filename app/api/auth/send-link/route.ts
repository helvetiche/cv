import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "../../../../src/lib/firebase-admin";
import { randomBytes } from "crypto";

const ALLOWED_EMAILS = (process.env.ALLOWED_EMAILS || "").split(",").map(e => e.trim().toLowerCase());

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check allowlist
    if (ALLOWED_EMAILS.length > 0 && ALLOWED_EMAILS[0] !== "") {
      if (!ALLOWED_EMAILS.includes(normalizedEmail)) {
        return NextResponse.json(
          { success: false, error: "Email not authorized" },
          { status: 403 }
        );
      }
    }

    // Get or create user
    let userRecord;
    try {
      userRecord = await adminAuth.getUserByEmail(normalizedEmail);
    } catch {
      userRecord = await adminAuth.createUser({
        email: normalizedEmail,
        emailVerified: true,
      });
    }

    // Generate a one-time code (64 chars)
    const code = randomBytes(32).toString("hex");
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes

    // Store the code in Firestore
    await adminDb.collection("auth_codes").doc(code).set({
      uid: userRecord.uid,
      email: normalizedEmail,
      expiresAt,
      used: false,
    });

    // Build the magic link
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const magicLink = `${baseUrl}/content?code=${code}`;

    // In production, you'd send an email here
    // For dev, return the link
    return NextResponse.json({
      success: true,
      message: "Sign-in link generated",
      ...(process.env.NODE_ENV === "development" && { magicLink }),
    });
  } catch (error) {
    console.error("Send link error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send sign-in link" },
      { status: 500 }
    );
  }
}
