import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/dbConfig";
import Writing from "@/models/Writings";

export async function GET(
  request: Request, 
  {params}: {params: Promise<{slug: string}>}
) {
  try {
    await connectDB();
    const { slug } = await params;

    const writing = await Writing.findOne({ slug });

    if (!writing) {
      return NextResponse.json({ message: "Writing not found" }, { status: 404 });
    }

    return NextResponse.json({ writing }, { status: 200 });
  } catch (error) {
    console.error("Error fetching writing:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// UPDATE a writing
export async function PUT(
  req: NextRequest,
  {params}: {params: Promise<{slug: string}>}
) {
  try {
    const { slug } = await params;
    await connectDB();
    
    const writing = await Writing.findOne({ slug });
    
    if (!writing) {
      return NextResponse.json({ error: "Writing not found" }, { status: 404 });
    }
    
    const { title, content, category, tags, excerpt, coverImage, isDraft } = await req.json();
    
    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }
    
    // Update the writing
    writing.title = title;
    writing.content = content;
    writing.category = category;
    writing.tags = tags;
    writing.excerpt = excerpt;
    writing.coverImage = coverImage;
    writing.isDraft = isDraft;
    
    await writing.save();
    
    return NextResponse.json(writing);
  } catch (error) {
    console.error("Error updating writing:", error);
    return NextResponse.json({ error: "Failed to update writing" }, { status: 500 });
  }
}

// DELETE a writing
export async function DELETE(
  req: NextRequest,
  {params}: {params: Promise<{slug: string}>}
) {
  try {
    const { slug } = await params;
    await connectDB();
    
    const writing = await Writing.findOne({ slug });
    
    if (!writing) {
      return NextResponse.json({ error: "Writing not found" }, { status: 404 });
    }
    
    await Writing.findOneAndDelete({ slug });
    
    return NextResponse.json({ message: "Writing deleted successfully" });
  } catch (error) {
    console.error("Error deleting writing:", error);
    return NextResponse.json({ error: "Failed to delete writing" }, { status: 500 });
  }
}