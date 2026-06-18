import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/src/lib/firebase-admin";

const COLLECTION = "projects";

// UPDATE project
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT project error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update project" },
      { status: 500 }
    );
  }
}

// DELETE project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await adminDb.collection(COLLECTION).doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE project error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
