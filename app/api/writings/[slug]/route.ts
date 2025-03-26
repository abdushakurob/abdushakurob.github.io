import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/dbConfig";
import Writing from "@/models/Writings";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();
    const writing = await Writing.findOne({ slug: params.slug });

    if (!writing) {
      return NextResponse.json(
        { error: "Writing not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ writing });
  } catch (error) {
    console.error("Failed to fetch writing:", error);
    return NextResponse.json(
      { error: "Failed to fetch writing" },
      { status: 500 }
    );
  }
}

// UPDATE a writing
export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const body = await request.json();
    const { title, content, category, tags, readingTime } = body;

    await connectDB();
    const writing = await Writing.findOneAndUpdate(
      { slug: params.slug },
      {
        title,
        content,
        category,
        tags: tags || [],
        readingTime,
        slug: title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
      },
      { new: true }
    );

    if (!writing) {
      return NextResponse.json(
        { error: "Writing not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ writing });
  } catch (error) {
    console.error("Failed to update writing:", error);
    return NextResponse.json(
      { error: "Failed to update writing" },
      { status: 500 }
    );
  }
}

// DELETE a writing
export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();
    const writing = await Writing.findOneAndDelete({ slug: params.slug });

    if (!writing) {
      return NextResponse.json(
        { error: "Writing not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Writing deleted successfully" });
  } catch (error) {
    console.error("Failed to delete writing:", error);
    return NextResponse.json(
      { error: "Failed to delete writing" },
      { status: 500 }
    );
  }
}