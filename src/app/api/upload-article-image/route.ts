export const runtime = "edge";

import { NextResponse } from "next/server";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"];

export async function POST(request: Request) {
  try {
    // Authentication: require admin password
    const authHeader = request.headers.get("Authorization");
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword || authHeader !== `Bearer ${adminPassword}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // 1. Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds 5MB limit" },
        { status: 400 }
      );
    }

    // 2. Validate file extension and MIME type
    const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext) || !file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files (JPG, PNG, WebP, GIF, SVG) are allowed" },
        { status: 400 }
      );
    }

    // On Cloudflare Pages Edge Workers, filesystem write is unavailable.
    // Return fallback so the client seamlessly uses browser Data URL storage.
    return NextResponse.json({ 
      success: false, 
      fallback: true,
      message: "Edge runtime detected; using client-side Data URL." 
    });
  } catch (error) {
    console.error("Error in upload route:", error);
    return NextResponse.json({ error: "Failed to process image" }, { status: 500 });
  }
}
