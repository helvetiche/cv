import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "../../../../src/lib/firebase-admin";

export async function POST(request: NextRequest) {
  try {
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

    const response = NextResponse.json({
      success: true,
      message: "Signed in successfully",
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
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
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to sign in" },
      { status: 500 }
    );
  }
}
