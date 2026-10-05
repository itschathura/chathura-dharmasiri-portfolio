import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique safe filename
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `${Date.now()}_${safeName}`;

    // Target directories
    const publicDir = path.join(process.cwd(), "public", "article");
    const assetDir = path.join(process.cwd(), "src", "asset", "article");

    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    if (!fs.existsSync(assetDir)) {
      fs.mkdirSync(assetDir, { recursive: true });
    }

    // Save to public/article for browser serving
    const publicPath = path.join(publicDir, filename);
    fs.writeFileSync(publicPath, buffer);

    // Save to src/asset/article for asset repository storage
    const assetPath = path.join(assetDir, filename);
    fs.writeFileSync(assetPath, buffer);

    const imageUrl = `/article/${filename}`;

    return NextResponse.json({ success: true, url: imageUrl });
  } catch (error) {
    console.error("Error saving image to article folder:", error);
    return NextResponse.json({ error: "Failed to save image" }, { status: 500 });
  }
}
