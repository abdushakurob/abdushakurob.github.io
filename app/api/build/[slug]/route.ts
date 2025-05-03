import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/dbConfig";
import Track from "@/models/Track";

// GET a specific track
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  await connectDB();
  try {
    const { slug } = params;
    const track = await Track.findOne({ slug });
    if (!track) return NextResponse.json({ error: "Track not found" }, { status: 404 });
    return NextResponse.json(track);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch track" }, { status: 500 });
  }
}

// POST a new update to a track
export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  await connectDB();
  try {
    const { title, content } = await req.json();
    if (!title || !content) return NextResponse.json({ error: "Title and content required" }, { status: 400 });

    const { slug } = params;
    const track = await Track.findOne({ slug });
    if (!track) return NextResponse.json({ error: "Track not found" }, { status: 404 });

    track.updates.push({ title, content, date: new Date() });
    await track.save();
    return NextResponse.json(track);
  } catch (error) {
    return NextResponse.json({ error: "Failed to add update" }, { status: 500 });
  }
}

// UPDATE a track
export async function PUT(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    await connectDB();
    
    const track = await Track.findOne({ slug });
    
    if (!track) {
      return NextResponse.json({ error: "Track not found" }, { status: 404 });
    }
    
    const { title, description, category, updates, milestones, links, isCompleted } = await req.json();
    
    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
    }
    
    // Update the track
    track.title = title;
    track.description = description;
    track.category = category;
    track.updates = updates;
    track.milestones = milestones;
    track.links = links;
    track.isCompleted = isCompleted;
    
    await track.save();
    
    return NextResponse.json(track);
  } catch (error) {
    console.error("Error updating track:", error);
    return NextResponse.json({ error: "Failed to update track" }, { status: 500 });
  }
}

// DELETE a track
export async function DELETE(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    await connectDB();
    
    const track = await Track.findOne({ slug });
    
    if (!track) {
      return NextResponse.json({ error: "Track not found" }, { status: 404 });
    }
    
    await Track.findOneAndDelete({ slug });
    
    return NextResponse.json({ message: "Track deleted successfully" });
  } catch (error) {
    console.error("Error deleting track:", error);
    return NextResponse.json({ error: "Failed to delete track" }, { status: 500 });
  }
}
