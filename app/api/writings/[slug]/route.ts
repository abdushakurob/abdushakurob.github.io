import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConfig";
import Writing from "@/models/Writings";

// ✅ GET a single writing by slug
export async function GET(req: Request, { params }: { params: { slug: string } }) {
  try {
    await connectDB();
    const writing = await Writing.findOne({ slug: params.slug });

    if (!writing) {
      return NextResponse.json({ error: "Writing not found" }, { status: 404 });
    }

    return NextResponse.json(writing);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch writing" }, { status: 500 });
  }
}
