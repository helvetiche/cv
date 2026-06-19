import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "../../../../src/lib/firebase-admin";

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

    // Get or create user in Firebase Auth
    try {
      await adminAuth.getUserByEmail(normalizedEmail);
    } catch {
      await adminAuth.createUser({
        email: normalizedEmail,
        emailVerified: true,
      });
    }

    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "Firebase API key not configured" },
        { status: 500 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const continueUrl = `${baseUrl}/content`;

    // Send the email sign-in link via Firebase's sendOobCode REST API
    const sendRes = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestType: "EMAIL_SIGNIN",
          email: normalizedEmail,
          continueUrl: continueUrl,
          canHandleCodeInApp: true,
        }),
      }
    );

    const sendData = await sendRes.json();

    if (sendData.error) {
      console.error("sendOobCode error:", sendData.error);
      return NextResponse.json(
        { success: false, error: "Failed to send sign-in email" },
        { status: 500 }
      );
    }

    // Firebase returns the email on success
    // For dev: also generate a link using Admin SDK so we can test without waiting for email
    let devLink: string | undefined;
    if (process.env.NODE_ENV === "development") {
      try {
        const actionCodeSettings = {
          url: continueUrl,
          handleCodeInApp: true,
        };
        // generateSignInWithEmailLink creates a valid Firebase email sign-in link
        const adminLink = await adminAuth.generateSignInWithEmailLink(
          normalizedEmail,
          actionCodeSettings
        );
        // For dev testing, create a direct link to /content with oobCode and email
        // This simulates what would happen if Firebase passed the email in the URL
        const url = new URL(adminLink);
        const oobCode = url.searchParams.get("oobCode");
        if (oobCode) {
          devLink = `${baseUrl}/content?oobCode=${oobCode}&mode=signIn&email=${encodeURIComponent(normalizedEmail)}`;
        } else {
          devLink = adminLink;
        }
      } catch (e) {
        console.error("Dev link generation error:", e);
      }
    }

    const response: Record<string, unknown> = {
      success: true,
      message: "Sign-in link sent! Check your email.",
    };

    if (devLink) {
      response.devLink = devLink;
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Send link error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send sign-in link" },
      { status: 500 }
    );
  }
}
