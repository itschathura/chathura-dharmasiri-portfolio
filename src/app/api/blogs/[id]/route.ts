export const runtime = "edge";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get("Authorization");
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword || authHeader !== `Bearer ${adminPassword}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await props.params;
    const body = await request.json();
    const { title, description, date, image, category, link, isStarred } = body;

    if (isStarred) {
      await prisma.blogPost.updateMany({
        where: { id: { not: id }, isStarred: true },
        data: { isStarred: false }
      });
    }

    const updated = await prisma.blogPost.update({
      where: { id },
      data: {
        title,
        description,
        date,
        image,
        category,
        link: link || null,
        ...(typeof isStarred === "boolean" ? { isStarred } : {})
      }
    });

    return NextResponse.json({ success: true, post: updated });
  } catch (error) {
    console.error("Failed to update blog post:", error);
    return NextResponse.json(
      { error: "Failed to update blog post" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get("Authorization");
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword || authHeader !== `Bearer ${adminPassword}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await props.params;

    await prisma.blogPost.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete blog post:", error);
    return NextResponse.json(
      { error: "Failed to delete blog post" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get("Authorization");
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword || authHeader !== `Bearer ${adminPassword}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await props.params;
    const { action } = await request.json();

    if (action === "toggle-star") {
      const current = await prisma.blogPost.findUnique({ where: { id } });
      if (!current) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }

      const nextStarred = !current.isStarred;

      if (nextStarred) {
        await prisma.blogPost.updateMany({
          where: { isStarred: true },
          data: { isStarred: false }
        });
      }

      const updated = await prisma.blogPost.update({
        where: { id },
        data: { isStarred: nextStarred }
      });

      return NextResponse.json({ success: true, post: updated });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Failed to patch blog post:", error);
    return NextResponse.json(
      { error: "Failed to update blog post" },
      { status: 500 }
    );
  }
}
