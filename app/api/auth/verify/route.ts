import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "../../../../src/lib/firebase-admin";

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { success: false, error: "Code is required" },
        { status: 400 }
      );
    }

    // Look up the code in Firestore
    const codeDoc = await adminDb.collection("auth_codes").doc(code).get();

    if (!codeDoc.exists) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired code" },
        { status: 401 }
      );
    }

    const codeData = codeDoc.data()!;

    // Check if already used
    if (codeData.used) {
      return NextResponse.json(
        { success: false, error: "Code already used" },
        { status: 401 }
      );
    }

    // Check expiration
    if (codeData.expiresAt < Date.now()) {
      return NextResponse.json(
        { success: false, error: "Code expired" },
        { status: 401 }
      );
    }

    // Mark code as used
    await codeDoc.ref.update({ used: true });

    // Create a session cookie using the UID
    const sessionCookie = await adminAuth.createSessionCookie(
      await adminAuth.createCustomToken(codeData.uid),
      { expiresIn: 60 * 60 * 24 * 5 * 1000 } // 5 days
    );

    // Set the session cookie
    const response = NextResponse.json({
      success: true,
      message: "Signed in successfully",
      user: {
        uid: codeData.uid,
        email: codeData.email,
      },
    });

    response.cookies.set("__session", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 5, // 5 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Verify error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to verify code" },
      { status: 500 }
    );
  }
}
