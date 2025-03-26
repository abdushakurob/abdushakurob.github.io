import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/dbConfig";
import Writing from "@/models/Writings";

// ✅ GET all writings
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const includeDrafts = searchParams.get('includeDrafts') === 'true';

    await connectDB();
    const query = includeDrafts ? {} : { isDraft: false };
    const writings = await Writing.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ writings });
  } catch (error) {
    console.error("Failed to fetch writings:", error);
    return NextResponse.json(
      { error: "Failed to fetch writings" },
      { status: 500 }
    );
  }
}

// ✅ POST a new writing
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, category, tags, readingTime, isDraft } = body;

    if (!title || !content || !category) {
      return NextResponse.json(
        { error: "Title, content, and category are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const writing = await Writing.create({
      title,
      content,
      category,
      tags: tags || [],
      readingTime,
      isDraft: isDraft || false,
      slug: title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
    });

    return NextResponse.json({ writing }, { status: 201 });
  } catch (error) {
    console.error("Failed to create writing:", error);
    return NextResponse.json(
      { error: "Failed to create writing" },
      { status: 500 }
    );
  }
}
