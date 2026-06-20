import { NextRequest, NextResponse } from "next/server";
import { securityHeaders } from "../../../../src/lib/auth-middleware";
import { apiLimiter } from "../../../../src/lib/rate-limit";

function getClientIp(request: NextRequest): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const xri = request.headers.get("x-real-ip");
  if (xri) return xri;
  return "unknown";
}

// GET - Check existing session cookie and return user info
export async function GET(request: NextRequest) {
  try {
    // Rate limiting: 60 requests per minute per IP
    const clientIp = getClientIp(request);
    const { success: rateOk } = await apiLimiter.limit(clientIp);
    if (!rateOk) {
      return NextResponse.json(
        { success: false, error: "Too many requests" },
        { status: 429 }
      );
    }

    const sessionCookie = request.cookies.get("__session")?.value;

    if (!sessionCookie) {
      return securityHeaders(
        NextResponse.json(
          { success: false, error: "Not authenticated" },
          { status: 401 }
        )
      );
    }

    // Dynamically import to avoid edge runtime issues
    const { adminAuth } = await import("../../../../src/lib/firebase-admin");
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);

    return securityHeaders(
      NextResponse.json({
        success: true,
        user: {
          uid: decodedClaims.uid,
          email: decodedClaims.email,
        },
      })
    );
  } catch (error) {
    console.error("Session check error:", error);
    return securityHeaders(
      NextResponse.json(
        { success: false, error: "Invalid session" },
        { status: 401 }
      )
    );
  }
}
