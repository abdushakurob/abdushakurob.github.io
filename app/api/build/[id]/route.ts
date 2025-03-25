import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/dbConfig";
import Track from "@/models/Track";

// GET a single track
export async function GET(
  req: NextRequest,
  {params}: {params: Promise<{id: string}>}
) {
  try {
    const { id } = await params;
    await connectDB();
    
    const track = await Track.findById(id);
    
    if (!track) {
      return NextResponse.json({ error: "Track not found" }, { status: 404 });
    }
    
    return NextResponse.json(track);
  } catch (error) {
    console.error("Error fetching track:", error);
    return NextResponse.json({ error: "Failed to fetch track" }, { status: 500 });
  }
}

// UPDATE a track
export async function PUT(
  req: NextRequest,
  {params}: {params: Promise<{id: string}>}
) {
  try {
    const { id } = await params;
    await connectDB();
    
    const track = await Track.findById(id);
    
    if (!track) {
      return NextResponse.json({ error: "Track not found" }, { status: 404 });
    }
    
    const { title, description, category, updates, milestones, links, isCompleted } = await req.json();
    
    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
    }
    
    const updatedTrack = await Track.findByIdAndUpdate(
      id,
      {
        title,
        description,
        category,
        updates,
        milestones,
        links,
        isCompleted
      },
      { new: true, runValidators: true }
    );
    
    return NextResponse.json(updatedTrack);
  } catch (error) {
    console.error("Error updating track:", error);
    return NextResponse.json({ error: "Failed to update track" }, { status: 500 });
  }
}

// DELETE a track
export async function DELETE(
  req: NextRequest,
  {params}: {params: Promise<{id: string}>}
) {
  try {
    const { id } = await params;
    await connectDB();
    
    const track = await Track.findById(id);
    
    if (!track) {
      return NextResponse.json({ error: "Track not found" }, { status: 404 });
    }
    
    await Track.findByIdAndDelete(id);
    
    return NextResponse.json({ message: "Track deleted successfully" });
  } catch (error) {
    console.error("Error deleting track:", error);
    return NextResponse.json({ error: "Failed to delete track" }, { status: 500 });
  }
} 