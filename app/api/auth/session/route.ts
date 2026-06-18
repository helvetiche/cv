import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "../../../../src/lib/firebase-admin";

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get("__session")?.value;

    if (!sessionCookie) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Verify the session cookie
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);

    return NextResponse.json({
      success: true,
      user: {
        uid: decodedClaims.uid,
        email: decodedClaims.email,
      },
    });
  } catch (error) {
    console.error("Session check error:", error);
    return NextResponse.json(
      { success: false, error: "Invalid session" },
      { status: 401 }
    );
  }
}
