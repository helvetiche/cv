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
    try {
      await adminAuth.getUserByEmail(normalizedEmail);
    } catch {
      await adminAuth.createUser({
        email: normalizedEmail,
        emailVerified: true,
      });
    }

    // Generate a one-time code and store it
    const code = randomBytes(32).toString("hex");
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes

    await adminDb.collection("auth_codes").doc(code).set({
      email: normalizedEmail,
      expiresAt,
      used: false,
    });

    // Build the magic link
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const magicLink = `${baseUrl}/content?code=${code}`;

    // Send email using Firebase's sendEmail via Admin SDK
    // Firebase Admin can send email verification / sign-in links natively
    try {
      // Use Firebase's built-in email sending capability
      // generateSignInWithEmailLink creates the proper Firebase email link
      const actionCodeSettings = {
        url: magicLink,
        handleCodeInApp: true,
      };

      // Firebase Admin SDK's generateSignInWithEmailLink
      const firebaseMagicLink = await adminAuth.generateSignInWithEmailLink(
        normalizedEmail,
        actionCodeSettings
      );

      // Now we need to send this link via email
      // Firebase doesn't send the email automatically, so we use a simple approach
      // For production, you'd use Firebase Extensions or a custom email trigger
      // For now, we'll use the Firebase Auth REST API to send the email

      const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
      if (apiKey) {
        const response = await fetch(
          `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              requestType: "EMAIL_SIGNIN",
              email: normalizedEmail,
              continueUrl: magicLink,
              canHandleCodeInApp: true,
            }),
          }
        );

        const result = await response.json();
        if (result.kind === "identitytoolkit#GetOobConfirmationCodeResponse") {
          // Firebase sent the email successfully
          return NextResponse.json({
            success: true,
            message: "Sign-in link sent! Check your email.",
            // Only show dev link in development
            ...(process.env.NODE_ENV === "development" && {
              devLink: magicLink,
              firebaseLink: firebaseMagicLink,
            }),
          });
        }
      }
    } catch (firebaseError) {
      console.error("Firebase email error:", firebaseError);
    }

    // Fallback: return the magic link for dev/testing
    return NextResponse.json({
      success: true,
      message: "Sign-in link generated",
      magicLink,
    });
  } catch (error) {
    console.error("Send link error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send sign-in link" },
      { status: 500 }
    );
  }
}
