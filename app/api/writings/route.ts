import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConfig";
import Writing from "@/models/Writings";

// ✅ GET all writings (published only)
export async function GET() {
  try {
    await connectDB();
    const writings = await Writing.find({ isDraft: false }).sort({ createdAt: -1 });
    return NextResponse.json(writings);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch writings" }, { status: 500 });
  }
}

// ✅ POST a new writing
export async function POST(req: Request) {
  try {
    await connectDB();
    const { title, content, category, tags, coverImage, isDraft } = await req.json();

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    const newWriting = await Writing.create({
      title,
      content,
      category,
      tags,
      coverImage,
      isDraft,
    });

    return NextResponse.json(newWriting, { status: 201 });
  } catch (error) {
    return NextResponse.json({ response: "Failed to create writing: ", error}, { status: 500 });
    console.log("Failed to create writing:", error);

  }
}
