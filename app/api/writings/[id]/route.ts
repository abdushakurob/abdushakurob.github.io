import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/dbConfig";
import Writing from "@/models/Writings";

// GET a single writing
export async function GET(
  req: NextRequest,
  {params}: {params: Promise<{id: string}>}
) {
  try {
    const { id } = await params;
    await connectDB();
    
    const writing = await Writing.findById(id);
    
    if (!writing) {
      return NextResponse.json({ error: "Writing not found" }, { status: 404 });
    }
    
    return NextResponse.json(writing);
  } catch (error) {
    console.error("Error fetching writing:", error);
    return NextResponse.json({ error: "Failed to fetch writing" }, { status: 500 });
  }
}

// UPDATE a writing
export async function PUT(
  req: NextRequest,
  {params}: {params: Promise<{id: string}>}
) {
  try {
    const { id } = await params;
    await connectDB();
    
    const writing = await Writing.findById(id);
    
    if (!writing) {
      return NextResponse.json({ error: "Writing not found" }, { status: 404 });
    }
    
    const { title, content, category, tags, excerpt, coverImage, isDraft } = await req.json();
    
    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }
    
    const updatedWriting = await Writing.findByIdAndUpdate(
      id,
      {
        title,
        content,
        category,
        tags,
        excerpt,
        coverImage,
        isDraft
      },
      { new: true, runValidators: true }
    );
    
    return NextResponse.json(updatedWriting);
  } catch (error) {
    console.error("Error updating writing:", error);
    return NextResponse.json({ error: "Failed to update writing" }, { status: 500 });
  }
}

// DELETE a writing
export async function DELETE(
  req: NextRequest,
  {params}: {params: Promise<{id: string}>}
) {
  try {
    const { id } = await params;
    await connectDB();
    
    const writing = await Writing.findById(id);
    
    if (!writing) {
      return NextResponse.json({ error: "Writing not found" }, { status: 404 });
    }
    
    await Writing.findByIdAndDelete(id);
    
    return NextResponse.json({ message: "Writing deleted successfully" });
  } catch (error) {
    console.error("Error deleting writing:", error);
    return NextResponse.json({ error: "Failed to delete writing" }, { status: 500 });
  }
}