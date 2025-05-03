import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/dbConfig";
import Writing from "@/models/Writings";

// GET all writings with filtering options
export async function GET(req: NextRequest) {
  try {
    console.log('Connecting to database...');
    await connectDB();
    console.log('Connected successfully');

    const searchParams = req.nextUrl.searchParams;
    const status = searchParams.get("status");

    let query = {};
    
    // Only return published writings by default
    if (!status) {
      query = { status: 'published' };
    } else if (status !== 'all') {
      query = { status };
    }

    console.log('Fetching writings with query:', query);
    const writings = await Writing.find(query).sort({ createdAt: -1 });
    console.log(`Found ${writings.length} writings`);
    
    return NextResponse.json({ writings });
  } catch (error) {
    console.error("Failed to fetch writings:", error);
    return NextResponse.json({ error: "Failed to fetch writings" }, { status: 500 });
  }
}

// POST a new writing
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { 
      title, content, category, tags, excerpt, coverImage, 
      status, seo 
    } = await req.json();

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    const publishedAt = status === 'published' ? new Date() : null;

    // Calculate reading time
    const words = content.split(/\s+/).length;
    const readingTime = Math.ceil(words / 200); // Assuming 200 words per minute

    // Generate excerpt if not provided
    const autoExcerpt = !excerpt ? content.replace(/<[^>]*>/g, '').substring(0, 150) + '...' : excerpt;

    // Create SEO metadata if not provided
    const seoData = {
      title: seo?.title || title,
      description: seo?.description || autoExcerpt,
      keywords: seo?.keywords || tags || []
    };

    const newWriting = await Writing.create({
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
    });

    return NextResponse.json({ writing: newWriting }, { status: 201 });
  } catch (error) {
    console.error("Failed to create writing:", error);
    return NextResponse.json({ error: "Failed to create writing" }, { status: 500 });
  }
}

// PUT update a writing
export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const { 
      title, content, category, tags, excerpt, coverImage,
      status, seo 
    } = await req.json();

    // Update publishedAt if status changes to published
    const existingWriting = await Writing.findOne({ slug });
    let publishedAt = existingWriting.publishedAt;
    
    if (status === 'published' && (!existingWriting.publishedAt || existingWriting.status !== 'published')) {
      publishedAt = new Date();
    }

    // Calculate reading time if content changed
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
    return NextResponse.json({ error: "Failed to update writing" }, { status: 500 });
  }
}
