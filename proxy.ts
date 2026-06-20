import { NextRequest, NextResponse } from "next/server";

// Lightweight proxy for auth redirects only.
// Heavy session validation (firebase-admin) happens in API routes directly,
// since the proxy runtime doesn't support Node.js modules.

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if accessing protected pages
  if (pathname.startsWith("/content")) {
    const sessionCookie = request.cookies.get("__session")?.value;

    // No session cookie — redirect to home
    // (actual session validity is checked server-side in the page/API routes)
    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Check if authenticated user is trying to access auth routes
  const isAuthRoute = pathname.startsWith("/api/auth/login");
  if (isAuthRoute) {
    const sessionCookie = request.cookies.get("__session")?.value;
    if (sessionCookie) {
      // Has a session cookie, likely authenticated — redirect to content
      // (if session is invalid, the API will reject it anyway)
      return NextResponse.redirect(new URL("/content", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/content", "/api/auth/login"],
};
