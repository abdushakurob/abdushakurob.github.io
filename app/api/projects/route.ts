import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/dbConfig";
import Project from "@/models/Projects";

// GET all projects or filter by featured
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const searchParams = req.nextUrl.searchParams;
    const featured = searchParams.get("featured");
    const status = searchParams.get("status");

    let query = {};
    
    // Only return published projects by default
    if (!status) {
      query = { status: 'published' };
    } else if (status !== 'all') {
      query = { status };
    }

    if (featured === "true") {
      query = { ...query, isFeatured: true };
    }

    const projects = await Project.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ projects });
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

// POST a new project
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { 
      title, description, content, coverImage, tags, category, 
      link, github, isFeatured, status, manualDate, customLinks 
    } = await req.json();

    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
    }

    const publishedAt = status === 'published' ? new Date() : null;

    const newProject = await Project.create({
      title,
      description,
      content,
      coverImage,
      tags,
      category,
      link,
      github,
      isFeatured,
      status,
      publishedAt,
      manualDate: manualDate ? new Date(manualDate) : undefined,
      customLinks: customLinks?.filter((link: any) => link.title && link.url)
    });

    return NextResponse.json({ project: newProject }, { status: 201 });
  } catch (error) {
    console.error("Failed to create project:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const { title, description, coverImage, tags, category, content, link, github, isFeatured, manualDate, customLinks } = await req.json();

    const updatedProject = await Project.findOneAndUpdate(
      { slug },
      {
        title,
        description,
        coverImage,
        tags,
        category,
        content,
        link,
        github,
        isFeatured,
        manualDate: manualDate ? new Date(manualDate) : undefined,
        customLinks: customLinks?.filter((link: any) => link.title && link.url)
      },
      { new: true }
    );

    if (!updatedProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ project: updatedProject });
  } catch (error) {
    console.error("Failed to update project:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}
