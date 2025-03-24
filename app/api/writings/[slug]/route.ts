import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConfig"; // Import your MongoDB connection
import Writing from "@/models/Writings"; // Import your Mongoose model

// ✅ Corrected GET function
export async function GET(req: NextRequest, context: { params: { slug: string } }) {
    try {
      await connectDB();
      const { slug } = context.params; // ✅ Correct way to access slug
  
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