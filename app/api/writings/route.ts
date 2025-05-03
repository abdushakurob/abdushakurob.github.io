import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/dbConfig";
import Writing from "@/models/Writings";

// GET all writings with filtering options
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const searchParams = req.nextUrl.searchParams;
    const status = searchParams.get("status");
    const referer = req.headers.get('referer');
    // Check if the referer hostname matches the expected admin domain
    // Replace 'admin.abdushakurob.xyz' with your actual admin domain, or use an environment variable
    const adminHostname = process.env.ADMIN_HOSTNAME || 'admin.abdushakur.me'; 
    const isAdminRoute = referer ? new URL(referer).hostname === adminHostname : false;
    const includeDraftsParam = searchParams.get("includeDrafts");

    const query: any = {}; // Changed let to const

    // Filter by status based on user role or explicit request
    if (!isAdminRoute && includeDraftsParam !== 'true') {
      // Non-admin users only see published writings unless includeDrafts=true is explicitly passed
      query.status = 'published';
    } else if (isAdminRoute) {
      // Admin users: Allow filtering by status if provided, otherwise show all statuses
      if (status && status !== 'all') {
        query.status = status;
      }
      // If no status filter from admin, query remains as is ({}), showing all statuses
    }
    // If includeDrafts=true is passed for non-admin, query remains {} - showing all statuses

    const writings = await Writing.find(query).sort({ createdAt: -1 });

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
