import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "../../../../src/lib/firebase-admin";

export async function POST(request: NextRequest) {
  try {
    const { oobCode, email } = await request.json();

    if (!oobCode || typeof oobCode !== "string") {
      return NextResponse.json(
        { success: false, error: "Code is required" },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "Firebase API key not configured" },
        { status: 500 }
      );
    }

    // Complete the email sign-in using Firebase's signInWithEmailLink REST API
    // This requires BOTH the oobCode and the email
    const signInRes = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithEmailLink?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          oobCode,
          email,
        }),
      }
    );

    const signInData = await signInRes.json();

    if (signInData.error || !signInData.idToken) {
      console.error("signInWithEmailLink error:", signInData.error);
      return NextResponse.json(
        { success: false, error: "Invalid or expired sign-in link. Please request a new one." },
        { status: 401 }
      );
    }

    const idToken = signInData.idToken;

    // Verify the ID token with Admin SDK
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userRecord = await adminAuth.getUser(decodedToken.uid);

    // Create a session cookie from the ID token
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: 60 * 60 * 24 * 5 * 1000, // 5 days
    });

    const response = NextResponse.json({
      success: true,
      message: "Signed in successfully",
      user: {
        uid: userRecord.uid,
        email,
      },
    });

    response.cookies.set("__session", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 5,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Verify error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to verify sign-in link" },
      { status: 500 }
    );
  }
}
