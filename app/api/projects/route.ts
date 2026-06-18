import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/src/lib/firebase-admin";

const COLLECTION = "projects";

// GET all projects
export async function GET() {
  try {
    const snapshot = await adminDb
      .collection(COLLECTION)
      .orderBy("createdAt", "desc")
      .get();

    const projects = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    console.error("GET projects error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

// CREATE new project
export async function POST(request: NextRequest) {
  try {
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

    return NextResponse.json({
      success: true,
      data: { id: docRef.id, title, description, tags, imageUrl, github, live, createdAt: now, updatedAt: now },
    });
  } catch (error) {
    console.error("POST project error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create project" },
      { status: 500 }
    );
  }
}
