import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/dbConfig";
import Project from "@/models/Projects";

// ✅ GET a single project by slug
export async function GET(req: NextRequest, {params}: {params: Promise<{slug: string}>}) {
  try {
    await connectDB();
    const { slug } = await params;
    const project = await Project.findOne({ slug });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}
