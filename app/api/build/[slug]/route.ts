import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/dbConfig";
import Track from "@/models/Track";

// ✅ GET a specific track
export async function GET(req: NextRequest, { params }: {params: Promise<{slug: string}>}) {
  await connectDB();
  try {
    const { slug } = await params;
    const track = await Track.findOne({ slug });
    if (!track) return NextResponse.json({ error: "Track not found" }, { status: 404 });
    return NextResponse.json(track);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch track" }, { status: 500 });
  }
}

// ✅ POST a new update to a track
export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  await connectDB();
  try {
    const { title, content } = await req.json();
    if (!title || !content) return NextResponse.json({ error: "Title and content required" }, { status: 400 });

    const track = await Track.findOne({ slug: params.slug });
    if (!track) return NextResponse.json({ error: "Track not found" }, { status: 404 });

    track.updates.push({ title, content, date: new Date() });
    await track.save();
    return NextResponse.json(track);
  } catch (error) {
    return NextResponse.json({ error: "Failed to add update" }, { status: 500 });
  }
}
