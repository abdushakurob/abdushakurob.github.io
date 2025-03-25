import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/dbConfig";
import Track from "@/models/Track";

// ✅ POST: Create a new track
export async function POST(req: NextRequest) {
  await connectDB();
  try {
    const { title, description, category, links } = await req.json();

    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
    }

    const newTrack = await Track.create({
      title,
      description,
      category,
      links,
      updates: [],
      milestones: [],
    });

    return NextResponse.json(newTrack, { status: 201 });
  } catch (error) {
    console.error("Failed to create track:", error);
    return NextResponse.json({ error: "Failed to create track" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  await connectDB();
  try {
    const tracks = await Track.find().sort({ createdAt: -1 }); // Get all tracks, sorted by newest first
    return NextResponse.json(tracks, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch tracks:", error);
    return NextResponse.json({ error: "Failed to fetch tracks" }, { status: 500 });
  }
}
