import { NextRequest, NextResponse } from "next/server";
import { csrfCheck, securityHeaders } from "../../../../src/lib/auth-middleware";

export async function POST(request: NextRequest) {
  try {
    if (!csrfCheck(request)) {
      return NextResponse.json(
        { success: false, error: "Invalid request origin" },
        { status: 403 }
      );
    }

    const response = securityHeaders(
      NextResponse.json({
        success: true,
        message: "Signed out successfully",
      })
    );

    // Clear the session cookie
    response.cookies.set("__session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to sign out" },
      { status: 500 }
    );
  }
}
