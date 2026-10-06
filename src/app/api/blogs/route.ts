export const runtime = "edge";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULT_POSTS = [
  {
    title: "Building Grounded RAG Systems with FastAPI & ChromaDB",
    description: "An in-depth guide on implementing robust guardrails, source attribution, and chunking strategies to eliminate LLM hallucinations.",
    date: "Oct 02, 2026",
    category: "AI & Engineering",
    image: "/cards/documind-ai.jpg",
    isStarred: true,
    link: "https://documind-ai-aqf.pages.dev/"
  },
  {
    title: "Real-time Telemetry Ingestion with XGBoost & ScyllaDB",
    description: "Architecting a high-throughput pipeline to process 10M+ telemetry rows for real-time race overtaking predictions.",
    date: "Sep 24, 2026",
    category: "Sports & Data Analysis",
    image: "/cards/research.jpg",
    isStarred: false,
    link: "https://github.com/itschathura/F1-PitLogic-Platform"
  }
];

export async function GET() {
  try {
    let posts = await prisma.blogPost.findMany({
      orderBy: [
        { isStarred: "desc" },
        { createdAt: "desc" }
      ]
    });

    // Seed default posts if database is empty on first run
    if (posts.length === 0) {
      for (const defPost of DEFAULT_POSTS) {
        await prisma.blogPost.create({
          data: defPost
        });
      }
      posts = await prisma.blogPost.findMany({
        orderBy: [
          { isStarred: "desc" },
          { createdAt: "desc" }
        ]
      });
    }

    return NextResponse.json({ success: true, posts });
  } catch (error) {
    console.error("Failed to fetch blog posts from PostgreSQL:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts", posts: [] },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword || authHeader !== `Bearer ${adminPassword}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, date, image, category, link, isStarred } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    // If this post is marked as starred, unstar other posts
    if (isStarred) {
      await prisma.blogPost.updateMany({
        where: { isStarred: true },
        data: { isStarred: false }
      });
    }

    const post = await prisma.blogPost.create({
      data: {
        title,
        description,
        date: date || new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
        image: image || "/cards/documind-ai.jpg",
        category: category || "AI & Engineering",
        link: link || null,
        isStarred: Boolean(isStarred)
      }
    });

    return NextResponse.json({ success: true, post }, { status: 201 });
  } catch (error) {
    console.error("Failed to create blog post:", error);
    return NextResponse.json(
      { error: "Failed to create blog post" },
      { status: 500 }
    );
  }
}
