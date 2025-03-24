import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConfig";
import Writing from "@/models/Writings";

interface RouteParams {
  params: {
    slug: string;
  };
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    await connectDB();
    const { slug } = params;

    const writing = await Writing.findOne({ slug });

    if (!writing) {
      return NextResponse.json({ message: "Writing not found" }, { status: 404 });
    }

    return NextResponse.json({writing}, {status: 200});
  } catch (error) {
    console.error("Error fetching writing:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}