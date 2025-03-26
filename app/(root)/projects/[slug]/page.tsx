"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { Code, GithubIcon } from "lucide-react";
import { processQuillHtml } from "@/lib/quill-html-processor";

// Add relative date function
function getRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)}w ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

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
  _id: string;
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
    <div className="min-h-screen bg-base-100 text-base-content">
      {/* Hero Section with Cover Image */}
      {project.coverImage && (
        <div className="relative w-full h-[60vh] min-h-[400px]">
          <Image 
            src={project.coverImage} 
            alt={project.title} 
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-12 md:p-24">
            <div className="max-w-5xl mx-auto">
              <Link href="/projects" className="inline-flex items-center text-white/80 hover:text-white mb-6 group">
                <span className="text-lg transform group-hover:-translate-x-1 transition-transform">←</span>
                <span className="ml-2">Back to projects</span>
              </Link>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{project.title}</h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-white/80">
                <span className="px-3 py-1 bg-white/10 backdrop-blur-sm text-white rounded-full">
                  {project.category}
                </span>
                <span>•</span>
                <time>
                  {project.manualDate 
                    ? getRelativeDate(project.manualDate)
                    : getRelativeDate(project.createdAt)}
                </time>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 sm:px-12 md:px-24 py-12">
        {/* Project Links - Sticky */}
        <div className="sticky top-4 z-10 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-100 dark:border-gray-700 mb-8">
          <div className="flex flex-wrap gap-4">
            {project.link && (
              <a 
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30"
              >
                <Code size={20} />
                <span>View Live Project</span>
              </a>
            )}
            {project.github && (
              <a 
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-200 shadow-lg shadow-gray-800/20 hover:shadow-gray-800/30"
              >
                <GithubIcon size={20} />
                <span>View on GitHub</span>
              </a>
            )}
            {project.customLinks?.map((link, index) => (
              <a 
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 text-gray-700 dark:text-gray-200 rounded-lg hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-700 transition-all duration-200 shadow-lg shadow-gray-500/10 hover:shadow-gray-500/20"
              >
                {link.icon && <span className="text-lg">{link.icon}</span>}
                <span>{link.title}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Project Content */}
        <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-bold prose-a:text-blue-500 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:shadow-lg" 
          dangerouslySetInnerHTML={{ __html: processQuillHtml(project.content || project.description) }} />

        {/* Tags */}
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-8">
            {project.tags.map((tag, index) => (
              <span 
                key={index} 
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Related Projects */}
        {relatedWritings.length > 0 && (
          <div className="pt-12 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-6">Related Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedWritings.map((writing) => (
                <Link 
                  key={writing.slug} 
                  href={`/writings/${writing.slug}`}
                  className="group block p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-500 transition-colors">
                    {writing.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {writing.description}
                  </p>
                  <div className="mt-4 flex items-center text-blue-500 text-sm">
                    <span>Read more</span>
                    <span className="ml-1 transform group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}