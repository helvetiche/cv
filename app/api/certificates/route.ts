import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/src/lib/firebase-admin";
import { requireAuth, csrfCheck, securityHeaders } from "@/src/lib/auth-middleware";
import { apiLimiter } from "@/src/lib/rate-limit";

const COLLECTION = "certificates";

// GET all certificates (public)
export async function GET(request: NextRequest) {
  try {
    // Rate limiting: 60 requests per minute per IP
    const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
    const { success: rateOk, limit, reset } = await apiLimiter.limit(clientIp);
    if (!rateOk) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil((reset - Date.now()) / 1000)),
            "X-RateLimit-Limit": String(limit),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(Math.ceil(reset / 1000)),
          },
        }
      );
    }

    const snapshot = await adminDb
      .collection(COLLECTION)
      .orderBy("createdAt", "desc")
      .get();

    const certificates = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return securityHeaders(
      NextResponse.json({ success: true, data: certificates })
    );
  } catch (error) {
    console.error("GET certificates error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch certificates" },
      { status: 500 }
    );
  }
}

// CREATE new certificate (protected)
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Rate limiting: 60 requests per minute per user
    const { success: rateOk, limit, reset } = await apiLimiter.limit(user.uid);
    if (!rateOk) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil((reset - Date.now()) / 1000)),
            "X-RateLimit-Limit": String(limit),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(Math.ceil(reset / 1000)),
          },
        }
      );
    }

    if (!csrfCheck(request)) {
      return NextResponse.json(
        { success: false, error: "Invalid request origin" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, issuer, date, credentialUrl, description, imageUrl } = body;

    if (!title?.trim() || !issuer?.trim()) {
      return NextResponse.json(
        { success: false, error: "Title and issuer are required" },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const trimmedTitle = title.trim();
    const trimmedIssuer = issuer.trim();
    const docRef = await adminDb.collection(COLLECTION).add({
      title: trimmedTitle,
      issuer: trimmedIssuer,
      date: date || "",
      credentialUrl: credentialUrl || "",
      description: description || "",
      imageUrl: imageUrl || "",
      createdAt: now,
      updatedAt: now,
    });

    return securityHeaders(
      NextResponse.json({
        success: true,
        data: {
          id: docRef.id,
          title: trimmedTitle,
          issuer: trimmedIssuer,
          date: date || "",
          credentialUrl: credentialUrl || "",
          description: description || "",
          imageUrl: imageUrl || "",
          createdAt: now,
          updatedAt: now,
        },
      })
    );
  } catch (error) {
    console.error("POST certificate error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create certificate" },
      { status: 500 }
    );
  }
}
