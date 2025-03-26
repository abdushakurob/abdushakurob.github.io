"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { Code, GithubIcon } from "lucide-react";
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
        setProject(res.data.project);
        
        // Fetch related writings if project has tags
        if (res.data.project.tags?.length > 0) {
          const writingsRes = await axios.get('/api/writings');
          const allWritings = writingsRes.data.writings;
          
          // Filter writings that share at least one tag with the project
          const related = allWritings.filter((writing: Writing) => 
            writing.tags?.some(tag => res.data.project.tags.includes(tag))
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
      <div className="mb-8">
        <Link href="/projects" className="inline-flex items-center text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200">
          <span className="text-lg">←</span>
          <span className="ml-2">Back to projects</span>
        </Link>
      </div>

      {/* Project Details */}
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">{project.title}</h1>
          <div className="mt-2 flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
            <span className="px-2.5 py-0.5 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
              {project.category}
            </span>
            <span>•</span>
            <time>
              {project.manualDate 
                ? new Date(project.manualDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                : new Date(project.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </time>
          </div>
        </div>

        {/* Cover Image */}
        {project.coverImage && (
          <div className="relative w-full h-[400px] rounded-xl overflow-hidden">
            <Image 
              src={project.coverImage} 
              alt={project.title} 
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Project Content */}
        <div className="prose prose-lg max-w-none dark:prose-invert" 
          dangerouslySetInnerHTML={{ __html: processQuillHtml(project.content || project.description) }} />

        {/* Tags */}
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag, index) => (
              <span key={index} className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Links */}
        <div className="flex flex-wrap items-center gap-4 pt-4">
          {project.link && (
            <a 
              href={project.link} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              <Code size={18} />
              <span>View Live Project</span>
            </a>
          )}
          {project.github && (
            <a 
              href={project.github} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg transition-colors"
            >
              <GithubIcon size={18} />
              <span>View Source</span>
            </a>
          )}
          {project.customLinks?.map((link, index) => (
            <a 
              key={index} 
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg transition-colors"
            >
              <span>{link.title}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Related Writings */}
      {relatedWritings.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Related Writings</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedWritings.map((writing) => (
              <Link key={writing.slug} href={`/writings/${writing.slug}`}>
                <div className="group bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-500 transition-colors">
                    {writing.title}
                  </h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                    {writing.description}
                  </p>
                  {writing.tags && writing.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {writing.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
