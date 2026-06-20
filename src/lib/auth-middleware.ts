import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "./firebase-admin";

export async function requireAuth(
  request: NextRequest
): Promise<{ uid: string; email: string } | null> {
  const sessionCookie = request.cookies.get("__session")?.value;
  if (!sessionCookie) return null;

  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    return { uid: decoded.uid, email: decoded.email || "" };
  } catch {
    return null;
  }
}

export function csrfCheck(request: NextRequest): boolean {
  const origin = request.headers.get("origin") || request.headers.get("referer") || "";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  if (siteUrl && origin && !origin.startsWith(siteUrl)) {
    return false;
  }
  return true;
}

export function securityHeaders(response: NextResponse): NextResponse {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://identitytoolkit.googleapis.com https://*.googleapis.com https://api.imgbb.com;"
  );
  if (process.env.NODE_ENV === "production") {
    response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  }
  return response;
}
