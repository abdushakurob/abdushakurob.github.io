import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/dbConfig";
import Project from "@/models/Projects";

// ✅ GET all projects
export async function GET() {
  try {
    await connectDB();
    const projects = await Project.find().sort({ createdAt: -1 });
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

// ✅ POST a new project
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { title, description, coverImage, tags, category, link, github, isFeatured } = await req.json();

    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
    }

    const newProject = await Project.create({
      title,
      description,
      coverImage,
      tags,
      category,
      link,
      github,
      isFeatured,
    });

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error("Failed to create project:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
