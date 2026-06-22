import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/src/lib/firebase-admin";
import { requireAuth, csrfCheck, securityHeaders } from "@/src/lib/auth-middleware";
import { apiLimiter } from "@/src/lib/rate-limit";

const COLLECTION = "projects";

// GET all projects (protected)
export async function GET(request: NextRequest) {
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

    const snapshot = await adminDb
      .collection(COLLECTION)
      .orderBy("createdAt", "desc")
      .get();

    const projects = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return securityHeaders(
      NextResponse.json({ success: true, data: projects })
    );
  } catch (error) {
    console.error("GET projects error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

// CREATE new project (protected)
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
    const { title, description, tags, imageUrl, github, live } = body;

    if (!title?.trim() || !description?.trim()) {
      return NextResponse.json(
        { success: false, error: "Title and description are required" },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();
    const docRef = await adminDb.collection(COLLECTION).add({
      title: trimmedTitle,
      description: trimmedDescription,
      tags: tags || [],
      imageUrl: imageUrl || "",
      github: github || "",
      live: live || "",
      createdAt: now,
      updatedAt: now,
    });

    return securityHeaders(
      NextResponse.json({
        success: true,
        data: { id: docRef.id, title: trimmedTitle, description: trimmedDescription, tags: tags || [], imageUrl: imageUrl || "", github: github || "", live: live || "", createdAt: now, updatedAt: now },
      })
    );
  } catch (error) {
    console.error("POST project error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create project" },
      { status: 500 }
    );
  }
}
