import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/src/lib/firebase-admin";
import { requireAuth, csrfCheck, securityHeaders } from "@/src/lib/auth-middleware";

const COLLECTION = "projects";

// UPDATE project (protected)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const body = await request.json();
    const { title, description, tags, imageUrl, github, live } = body;

    if (!title?.trim() || !description?.trim()) {
      return NextResponse.json(
        { success: false, error: "Title and description are required" },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    await adminDb.collection(COLLECTION).doc(id).update({
      title: title.trim(),
      description: description.trim(),
      tags: tags || [],
      imageUrl: imageUrl || "",
      github: github || "",
      live: live || "",
      updatedAt: now,
    });

    return securityHeaders(NextResponse.json({ success: true }));
  } catch (error) {
    console.error("PUT project error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update project" },
      { status: 500 }
    );
  }
}

// DELETE project (protected)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    await adminDb.collection(COLLECTION).doc(id).delete();
    return securityHeaders(NextResponse.json({ success: true }));
  } catch (error) {
    console.error("DELETE project error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
