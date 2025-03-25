import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/dbConfig";
import Track from "@/models/Track";

// GET all tracks
export async function GET() {
  try {
    await connectDB();
    const tracks = await Track.find().sort({ createdAt: -1 });
    return NextResponse.json(tracks);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch tracks" }, { status: 500 });
  }
}

// POST a new track
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { title, description, category, updates, milestones, links, isCompleted } = await req.json();

    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
    }

    const newTrack = await Track.create({
      title,
      description,
      category,
      updates: updates || [],
      milestones: milestones || [],
      links: links || [],
      isCompleted: isCompleted || false
    });

    return NextResponse.json(newTrack, { status: 201 });
  } catch (error) {
    console.error("Failed to create track:", error);
    return NextResponse.json({ error: "Failed to create track" }, { status: 500 });
  }
}
