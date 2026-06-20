import { NextRequest, NextResponse } from "next/server";
import { requireAuth, csrfCheck, securityHeaders } from "@/src/lib/auth-middleware";

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

    const formData = await request.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No image file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { success: false, error: "File must be an image" },
        { status: 400 }
      );
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: "Image size must be less than 10MB" },
        { status: 400 }
      );
    }

    // Upload to imgbb
    const imgbbKey = process.env.IMGBB_API_KEY;
    if (!imgbbKey) {
      return NextResponse.json(
        { success: false, error: "imgbb API key not configured" },
        { status: 500 }
      );
    }

    const imgbbFormData = new FormData();
    imgbbFormData.append("image", file);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${imgbbKey}`,
      {
        method: "POST",
        body: imgbbFormData,
      }
    );

    const data = await response.json();

    if (data.success) {
      return securityHeaders(
        NextResponse.json({
          success: true,
          url: data.data.url,
          thumb: data.data.thumb?.url,
        })
      );
    } else {
      throw new Error(data.error?.message || "imgbb upload failed");
    }
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
