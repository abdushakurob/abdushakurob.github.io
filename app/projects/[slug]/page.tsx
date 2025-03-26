"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { Code, GithubIcon, TagIcon } from "lucide-react";
import { processQuillHtml } from "@/lib/quill-html-processor";

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
  manualDate?: string;
  content?: string;
  customLinks?: Array<{
    title: string;
    url: string;
    icon?: string;
  }>;
}

interface Writing {
  title: string;
  slug: string;
  description: string;
  tags?: string[];
  createdAt: string;
}

export default function ProjectPage() {
  const { slug } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [relatedWritings, setRelatedWritings] = useState<Writing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchProject() {
      try {
        setError(false);
        const res = await axios.get(`/api/projects/${slug}`);
        setProject(res.data);
        
        // Fetch related writings if project has tags
        if (res.data.tags?.length > 0) {
          const writingsRes = await axios.get('/api/writings');
          const allWritings = writingsRes.data;
          
          // Filter writings that share at least one tag with the project
          const related = allWritings.filter((writing: Writing) => 
            writing.tags?.some(tag => res.data.tags.includes(tag))
          ).slice(0, 3); // Get top 3 related writings
          
          setRelatedWritings(related);
        }
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
       {/* Back Button */}
       <div className="mt-10">
        <Link href="/projects" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          ← Back to Projects
        </Link>
      </div>
      {/* Project Details */}
      <h1 className="text-4xl font-bold text-green-600 mb-2">{project.title}</h1>
      <p className="text-gray-600 text-sm">
        {project.category} • {project.manualDate ? new Date(project.manualDate).toLocaleDateString() : new Date(project.createdAt).toLocaleDateString()}
      </p>

      {/* Cover Image */}
      {project.coverImage && (
        <img src={project.coverImage} alt={project.title} className="w-full max-h-96 object-cover rounded-lg mt-6 shadow-lg" />
      )}

      {/* Project Content (WYSIWYG) */}
      <div className="mt-6 prose prose-lg max-w-none" 
        dangerouslySetInnerHTML={{ __html: processQuillHtml(project.content || project.description) }} />

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
      <div className="flex flex-wrap gap-4 mt-8">
        {project.link && (
          <a href={project.link} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            <span className="flex"><Code/><span className="ml-2"> Live Project</span></span>
          </a>
        )}
        {project.github && (
          <a href={project.github} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800">
            <span className="flex"><GithubIcon/> <span className="ml-2"> GitHub Repo</span></span>
          </a>
        )}
        {project.customLinks?.map((link, index) => (
          <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" 
             className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
            {link.title} →
          </a>
        ))}
      </div>

      {/* Related Writings */}
      {relatedWritings.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-green-600 mb-6">Related Writings</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedWritings.map((writing) => (
              <Link key={writing.slug} href={`/writings/${writing.slug}`}>
                <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg hover:shadow-lg transition">
                  <h3 className="text-xl font-semibold text-blue-500">{writing.title}</h3>
                  <p className="text-gray-600 mt-2">{writing.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {writing.tags?.map((tag, index) => (
                      <span key={index} className="px-2 py-1 text-sm bg-gray-200 rounded-full text-gray-600">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
