import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/dbConfig";
import Track from "@/models/Track";

// GET a single build by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const build = await Track.findOne({ slug });

    if (!build) {
      return NextResponse.json({ error: "Build not found" }, { status: 404 });
    }

    return NextResponse.json({ build });
  } catch (error) {
    console.error(`Failed to fetch build with slug ${(await params).slug}:`, error);
    const errorMessage = (error as Error).message || "Unknown error";
    return NextResponse.json({ error: "Failed to fetch build", details: errorMessage }, { status: 500 });
  }
}

// PUT update a build by slug
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const {
      title,
      description,
      category,
      isCompleted,
      updates,
      milestones,
      links,
      status,
      manualDate
    } = await request.json();

    const existingBuild = await Track.findOne({ slug });
    if (!existingBuild) {
      return NextResponse.json({ error: "Build not found" }, { status: 404 });
    }

    // Determine publishedAt based on status change
    let publishedAt = existingBuild.publishedAt;
    if (status === 'published' && (!existingBuild.publishedAt || existingBuild.status !== 'published')) {
      publishedAt = new Date();
    }

    const updatedBuild = await Track.findOneAndUpdate(
      { slug },
      {
        title,
        description,
        category,
        isCompleted,
        updates,
        milestones,
        links,
        status,
        publishedAt,
        manualDate: manualDate ? new Date(manualDate) : existingBuild.manualDate,
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json({ build: updatedBuild });
  } catch (error) {
    console.error(`Failed to update build with slug ${(await params).slug}:`, error);
    const errorMessage = (error as Error).message || "Unknown error";
    return NextResponse.json({ error: "Failed to update build", details: errorMessage }, { status: 500 });
  }
}

// DELETE a build by slug
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const deletedBuild = await Track.findOneAndDelete({ slug });

    if (!deletedBuild) {
      return NextResponse.json({ error: "Build not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Build deleted successfully" });
  } catch (error) {
    console.error(`Failed to delete build with slug ${(await params).slug}:`, error);
    const errorMessage = (error as Error).message || "Unknown error";
    return NextResponse.json({ error: "Failed to delete build", details: errorMessage }, { status: 500 });
  }
}
