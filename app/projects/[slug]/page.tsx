"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { Code, GithubIcon, TagIcon } from "lucide-react";

interface Project {
  title: string;
  description: string;
  category: string;
  tags?: string[];
  coverImage?: string;
  link?: string;
  github?: string;
  isFeatured?: boolean;
  createdAt: string;
  content?: string; // ✅ Supports rich text (WYSIWYG content)
}

export default function ProjectPage() {
  const { slug } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchProject() {
      try {
        setError(false);
        const res = await axios.get(`/api/projects/${slug}`);
        setProject(res.data);
      } catch (err) {
        console.error("Failed to fetch project:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    if (slug) fetchProject();
  }, [slug]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-500">Loading project...</p>
      </div>
    );

  if (error || !project)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <p className="text-xl text-red-500">Project not found or failed to load.</p>
        <Link href="/projects" className="mt-4 text-blue-500 hover:underline">
          ← Back to Projects
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-base-100 text-base-content px-6 sm:px-12 md:px-24 py-12 max-w-5xl mx-auto">
      
      {/* Project Details */}
      <h1 className="text-4xl font-bold text-green-600 mb-2">{project.title}</h1>
      <p className="text-gray-600 text-sm">{project.category} • {new Date(project.createdAt).toDateString()}</p>

      {/* Cover Image */}
      {project.coverImage && (
        <img src={project.coverImage} alt={project.title} className="w-full max-h-96 object-cover rounded-lg mt-6 shadow-lg" />
      )}

      {/* Project Content (WYSIWYG) */}
      <div className="mt-6 prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: project.content || project.description }} />

      {/* Tags */}
      {project.tags && project.tags.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-blue-500">Tags:</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {project.tags.map((tag, index) => (
              <span key={index} className="px-3 py-1 text-sm bg-gray-200 rounded-lg text-gray-700">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Links */}
      <div className="mt-8 flex gap-4">
        {project.link && (
          <a href={project.link} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            <span className="flex"><Code/><span>Live Project</span></span>
          </a>
        )}
        {project.github && (
          <a href={project.github} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800">
            <span className="flex"><GithubIcon/> GitHub Repo</span>
          </a>
        )}
      </div>

      {/* Back Button */}
      <div className="mt-10">
        <Link href="/projects" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          ← Back to Projects
        </Link>
      </div>
    </div>
  );
}
