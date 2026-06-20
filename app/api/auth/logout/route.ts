import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // CSRF: Verify Origin/Referer matches expected site
    const origin = request.headers.get("origin") || request.headers.get("referer") || "";
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
    if (siteUrl && origin && !origin.startsWith(siteUrl)) {
      return NextResponse.json(
        { success: false, error: "Invalid request origin" },
        { status: 403 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: "Signed out successfully",
    });

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
