'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { generateStructuredData, generateBreadcrumbData } from '@/lib/utils';

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
  updatedAt: string;
  publishedAt?: string;
  manualDate?: string;
  content?: string;
  customLinks?: Array<{
    title: string;
    url: string;
    icon?: string;
  }>;
}

export default function ProjectDetail({ slug }: { slug: string }) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchProject() {
      try {
        setError(false);
        setLoading(true);
        const { data } = await axios.get(`/api/projects/${slug}`);
        setProject(data.project);
      } catch (err) {
        console.error("Failed to fetch project:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchProject();
    }
  }, [slug]);

  const jsonLd = project ? generateStructuredData({
    type: 'Project',
    title: project.title,
    description: project.description,
    coverImage: project.coverImage,
    datePublished: project.publishedAt || project.createdAt,
    dateModified: project.updatedAt,
    slug: slug,
    tags: project.tags
  }) : null;

  const breadcrumbData = project ? generateBreadcrumbData([
    { name: 'Home', item: '/' },
    { name: 'Projects', item: '/projects' },
    { name: project.title, item: `/projects/${slug}` }
  ]) : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-tea-900 to-tea-800 dark:from-lapis-200 dark:to-lapis-300 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <p className="text-lg text-lapis-300 dark:text-tea-800/60">Loading project...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-tea-900 to-tea-800 dark:from-lapis-200 dark:to-lapis-300 flex flex-col items-center justify-center">
        <p className="text-xl text-red-500">Project not found or failed to load.</p>
        <Link href="/projects" 
              className="mt-4 text-verdigris-DEFAULT hover:text-verdigris-600 dark:text-verdigris-600 dark:hover:text-verdigris-500 hover:underline">
          ← Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-tea-900/50 dark:bg-lapis-200/50 text-lapis-DEFAULT dark:text-tea-800 px-6 sm:px-12 md:px-24 py-12 max-w-5xl mx-auto">
      {jsonLd && (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
          />
        </>
      )}

      <nav className="text-sm mb-8 flex items-center space-x-2">
        <Link href="/projects" 
              className="text-verdigris-DEFAULT hover:text-verdigris-600 dark:text-verdigris-600 dark:hover:text-verdigris-500">
          ← Back to Projects
        </Link>
      </nav>

      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-lapis-DEFAULT dark:text-lapis-700">
          {project.title}
        </h1>
        
        <div className="flex flex-wrap gap-4 items-center text-sm text-lapis-400 dark:text-tea-800/80">
          {project.manualDate || project.publishedAt || project.createdAt ? (
            <time dateTime={project.manualDate || project.publishedAt || project.createdAt}>
              {new Date(project.manualDate || project.publishedAt || project.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long'
              })}
            </time>
          ) : null}
          {project.category && (
            <>
              {(project.manualDate || project.publishedAt || project.createdAt) && <span>•</span>}
              <span className="px-2 py-1 bg-emerald-DEFAULT/10 text-emerald-DEFAULT dark:bg-emerald-600/10 dark:text-emerald-600 rounded-full text-xs">
                {project.category}
              </span>
            </>
          )}
        </div>

        <p className="mt-4 text-lg text-lapis-400 dark:text-tea-800">
          {project.description}
        </p>

        {(project.link || project.github || (project.customLinks && project.customLinks.length > 0)) && (
          <div className="mt-6 flex flex-wrap gap-4">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-lapis-DEFAULT hover:bg-lapis-600 dark:bg-lapis-700 dark:hover:bg-lapis-600 text-white rounded-lg transition-colors"
              >
                View on GitHub
              </a>
            )}
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-verdigris-DEFAULT hover:bg-verdigris-600 dark:bg-verdigris-600 dark:hover:bg-verdigris-500 text-white rounded-lg transition-colors"
              >
                Visit Project
              </a>
            )}
            {project.customLinks?.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 border border-lapis-200 hover:bg-lapis-DEFAULT/10 dark:border-tea-800 dark:hover:bg-tea-800/10 rounded-lg transition-colors"
              >
                {link.title}
              </a>
            ))}
          </div>
        )}
      </header>

      {project.coverImage && (
        <div className="relative w-full h-[400px] mb-8 rounded-xl overflow-hidden">
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {project.content && (
        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: project.content }}
        />
      )}

      {project.tags && project.tags.length > 0 && (
        <div className="mt-8 pt-8 border-t border-lapis-200/20 dark:border-tea-800/20">
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag, index) => (
              <span 
                key={index} 
                className="px-3 py-1 text-sm bg-lapis-DEFAULT/5 dark:bg-tea-800/5 text-lapis-400 dark:text-tea-800 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}