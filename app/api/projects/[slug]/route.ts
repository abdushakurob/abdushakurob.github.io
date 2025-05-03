import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/dbConfig";
import Project from "@/models/Projects";

type RouteParams = { params: { slug: string } }

// GET a single project
export async function GET(
  req: NextRequest,
  context: RouteParams
) {
  try {
    await connectDB();
    const { slug } = context.params;

    const project = await Project.findOne({ slug });
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Only return non-published projects in admin routes
    const isAdminRoute = req.headers.get('referer')?.includes('/admin');
    if (!isAdminRoute && project.status !== 'published') {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error("Failed to fetch project:", error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}

// UPDATE a project
export async function PUT(
  req: NextRequest,
  context: RouteParams
) {
  try {
    await connectDB();
    const { slug } = context.params;
    const { 
      title, description, content, coverImage, tags, category, 
      link, github, isFeatured, status, manualDate, customLinks 
    } = await req.json();

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    // Get existing project to handle publishedAt date
    const existingProject = await Project.findOne({ slug });
    let publishedAt = existingProject.publishedAt;

    // Set publishedAt when project is first published
    if (status === 'published' && (!existingProject.publishedAt || existingProject.status !== 'published')) {
      publishedAt = new Date();
    }

    const updatedProject = await Project.findOneAndUpdate(
      { slug },
      {
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
      },
      { new: true }
    );

    if (!updatedProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ project: updatedProject });
  } catch (error) {
    console.error("Failed to update project:", error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

// DELETE a project
export async function DELETE(
  req: NextRequest,
  context: RouteParams
) {
  try {
    await connectDB();
    const { slug } = context.params;

    const deletedProject = await Project.findOneAndDelete({ slug });
    if (!deletedProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Failed to delete project:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
