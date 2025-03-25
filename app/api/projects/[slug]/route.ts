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

// UPDATE a project
export async function PUT(
  req: NextRequest,
  {params}: {params: Promise<{slug: string}>}
) {
  try {
    const { slug } = await params;
    await connectDB();
    
    const project = await Project.findOne({ slug });
    
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    
    const { title, description, content, coverImage, tags, category, link, github, isFeatured } = await req.json();
    
    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
    }
    
    // Update the project
    project.title = title;
    project.description = description;
    project.content = content;
    project.coverImage = coverImage;
    project.tags = tags;
    project.category = category;
    project.link = link;
    project.github = github;
    project.isFeatured = isFeatured;
    
    await project.save();
    
    return NextResponse.json(project);
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

// DELETE a project
export async function DELETE(
  req: NextRequest,
  {params}: {params: Promise<{slug: string}>}
) {
  try {
    const { slug } = await params;
    await connectDB();
    
    const project = await Project.findOne({ slug });
    
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    
    await Project.findOneAndDelete({ slug });
    
    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
