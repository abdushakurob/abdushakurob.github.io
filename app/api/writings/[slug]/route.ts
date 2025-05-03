import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/dbConfig";
import Writing from "@/models/Writings";

// GET a single writing
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const { slug } = await params;

    const writing = await Writing.findOne({ slug });
    if (!writing) {
      return NextResponse.json({ error: "Writing not found" }, { status: 404 });
    }

    // Only return non-published writings in admin routes
    const isAdminRoute = req.headers.get('referer')?.includes('/admin');
    if (!isAdminRoute && writing.status !== 'published') {
      return NextResponse.json({ error: "Writing not found" }, { status: 404 });
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
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const { slug } = await params;
    const { 
      title, content, category, tags, excerpt, coverImage,
      status, seo 
    } = await req.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    // Get existing writing to handle publishedAt date
    const existingWriting = await Writing.findOne({ slug });
    let publishedAt = existingWriting.publishedAt;

    // Set publishedAt when writing is first published
    if (status === 'published' && (!existingWriting.publishedAt || existingWriting.status !== 'published')) {
      publishedAt = new Date();
    }

    // Calculate reading time
    const words = content.split(/\s+/).length;
    const readingTime = Math.ceil(words / 200);

    // Generate excerpt if not provided
    const autoExcerpt = !excerpt ? content.replace(/<[^>]*>/g, '').substring(0, 150) + '...' : excerpt;

    // Update SEO metadata
    const seoData = {
      title: seo?.title || title,
      description: seo?.description || autoExcerpt,
      keywords: seo?.keywords || tags || []
    };

    const updatedWriting = await Writing.findOneAndUpdate(
      { slug },
      {
        title,
        content,
        category,
        tags,
        excerpt: autoExcerpt,
        coverImage,
        status,
        publishedAt,
        readingTime,
        seo: seoData
      },
      { new: true }
    );

    if (!updatedWriting) {
      return NextResponse.json({ error: "Writing not found" }, { status: 404 });
    }

    return NextResponse.json({ writing: updatedWriting });
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
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const { slug } = await params;

    const deletedWriting = await Writing.findOneAndDelete({ slug });
    if (!deletedWriting) {
      return NextResponse.json({ error: "Writing not found" }, { status: 404 });
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