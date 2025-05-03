import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/dbConfig";
import Track from "@/models/Track";

// GET all builds with filtering
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const searchParams = req.nextUrl.searchParams;
    const status = searchParams.get("status");
    const referer = req.headers.get('referer');
    const adminHostname = process.env.ADMIN_HOSTNAME || 'admin.abdushakur.me'; // Use your admin hostname
    const isAdminRoute = referer ? new URL(referer).hostname === adminHostname : false;

    let query: any = {};

    // Filter by status based on user role
    if (!isAdminRoute) {
      query.status = 'published'; // Non-admins only see published builds
    } else {
      // Admins can filter by status, otherwise see all
      if (status && status !== 'all') {
        query.status = status;
      }
    }

    // Sort by manualDate first (desc), then publishedAt (desc), then createdAt (desc)
    const builds = await Track.find(query).sort({ manualDate: -1, publishedAt: -1, createdAt: -1 });

    return NextResponse.json({ builds });
  } catch (error) {
    console.error("Failed to fetch builds:", error);
    // Type assertion for error object
    const errorMessage = (error as Error).message || "Unknown error";
    return NextResponse.json({ error: "Failed to fetch builds", details: errorMessage }, { status: 500 });
  }
}

// POST a new build
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const {
      title, description, content, category, tags,
      status, // New field
      manualDate // New field
    } = await req.json();

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // Determine publishedAt based on status
    const publishedAt = status === 'published' ? new Date() : null;

    const newBuild = await Track.create({
      title,
      description,
      content,
      category,
      tags,
      status: status || 'draft', // Default to draft if not provided
      publishedAt,
      manualDate: manualDate ? new Date(manualDate) : undefined, // Convert string date to Date object
    });

    return NextResponse.json({ build: newBuild }, { status: 201 });
  } catch (error) {
    console.error("Failed to create build:", error);
    // Type assertion for error object
    const errorMessage = (error as Error).message || "Unknown error";
    return NextResponse.json({ error: "Failed to create build", details: errorMessage }, { status: 500 });
  }
}
