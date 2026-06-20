import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/src/lib/firebase-admin";
import { requireAuth, csrfCheck, securityHeaders } from "@/src/lib/auth-middleware";

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
    const docRef = await adminDb.collection(COLLECTION).add({
      title: title.trim(),
      description: description.trim(),
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
        data: { id: docRef.id, title, description, tags, imageUrl, github, live, createdAt: now, updatedAt: now },
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
