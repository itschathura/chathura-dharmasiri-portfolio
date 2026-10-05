import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"];

export async function POST(request: Request) {
  try {
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
    const ext = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext) && !file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files (JPG, PNG, WebP, GIF, SVG) are allowed" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 3. Prevent path traversal and generate safe unique name
    const sanitizedBase = path.basename(file.name).replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `${Date.now()}_${sanitizedBase}`;

    // Target directories (local development / self-hosted environments)
    const publicDir = path.join(process.cwd(), "public", "article");
    const assetDir = path.join(process.cwd(), "src", "asset", "article");

    try {
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }
      if (!fs.existsSync(assetDir)) {
        fs.mkdirSync(assetDir, { recursive: true });
      }

      const publicPath = path.join(publicDir, filename);
      fs.writeFileSync(publicPath, buffer);

      const assetPath = path.join(assetDir, filename);
      fs.writeFileSync(assetPath, buffer);

      const imageUrl = `/article/${filename}`;
      return NextResponse.json({ success: true, url: imageUrl });
    } catch (fsErr) {
      // On read-only serverless platforms like Vercel, notify client to use Data URL fallback
      console.warn("Read-only filesystem detected (Serverless/Vercel):", fsErr);
      return NextResponse.json({ 
        success: false, 
        fallback: true,
        message: "Serverless environment detected; using client-side Data URL." 
      });
    }
  } catch (error) {
    console.error("Error in upload route:", error);
    return NextResponse.json({ error: "Failed to process image" }, { status: 500 });
  }
}

