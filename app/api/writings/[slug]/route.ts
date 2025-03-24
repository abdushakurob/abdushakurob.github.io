import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConfig";
import Writing from "@/models/Writings";

// Define the params type explicitly
type Params = {
  params: {
    slug: string;
  };
};

export async function GET(
  request: NextRequest,
  { params }: Params
) {
  try {
    await connectDB();
    const { slug } = params;

    const writing = await Writing.findOne({ slug });

    if (!writing) {
      return NextResponse.json({ message: "Writing not found" }, { status: 404 });
    }

    return NextResponse.json(writing);
  } catch (error) {
    console.error("Error fetching writing:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}