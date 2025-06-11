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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <p className="text-lg text-gray-600 dark:text-gray-400">Loading project...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center">
        <p className="text-xl text-red-500">Project not found or failed to load.</p>
        <Link href="/projects" className="mt-4 text-blue-500 hover:underline">
          ← Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-parchment-500 dark:bg-midnight-green-500 text-midnight-green-500 dark:text-parchment-500 px-6 sm:px-12 md:px-24 py-12 max-w-5xl mx-auto">
      {/* Navigation */}
      <nav className="mb-8 flex items-center text-sm">
        <Link 
          href="/" 
          className="text-midnight-green-400 hover:text-sea-green-500 dark:text-tea-green-400 dark:hover:text-sea-green-400"
        >
          Home
        </Link>
        <span className="mx-2 text-midnight-green-300 dark:text-tea-green-300">/</span>
        <Link 
          href="/projects"
          className="text-midnight-green-400 hover:text-sea-green-500 dark:text-tea-green-400 dark:hover:text-sea-green-400"
        >
          Projects
        </Link>
        <span className="mx-2 text-midnight-green-300 dark:text-tea-green-300">/</span>
        <span className="text-midnight-green-500 dark:text-parchment-500">{project.title}</span>
      </nav>

      {/* Project Info */}
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-midnight-green-500 dark:text-parchment-500">{project.title}</h1>
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="px-2.5 py-0.5 bg-sea-green-500/10 text-sea-green-500 dark:bg-sea-green-400/10 dark:text-sea-green-400 rounded-full">
              {project.category}
            </span>
            <span className="text-midnight-green-400 dark:text-tea-green-400">
              {new Date(project.publishedAt || project.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Project Links */}
        <div className="flex flex-wrap gap-4">
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-sea-green-500 text-parchment-500 dark:bg-sea-green-400 dark:text-midnight-green-500 rounded-lg hover:bg-sea-green-600 dark:hover:bg-sea-green-300 transition-colors"
            >
              <span>View Live</span>
              <span>↗</span>
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 border border-midnight-green-500 text-midnight-green-500 dark:border-parchment-500 dark:text-parchment-500 rounded-lg hover:bg-midnight-green-500/5 dark:hover:bg-parchment-500/5 transition-colors"
            >
              <span>View Code</span>
              <span>↗</span>
            </a>
          )}
          {project.customLinks?.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-midnight-green-400 dark:text-tea-green-400 bg-parchment-600 dark:bg-midnight-green-400 rounded-lg hover:bg-parchment-700 dark:hover:bg-midnight-green-300 transition-colors"
            >
              <span>{link.title}</span>
              <span>↗</span>
            </a>
          ))}
        </div>

        {/* Project Content */}
        <div>
          <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-midnight-green-500 dark:prose-headings:text-parchment-500 prose-p:text-midnight-green-400 dark:prose-p:text-tea-green-400 prose-a:text-sea-green-500 dark:prose-a:text-sea-green-400 hover:prose-a:text-sea-green-600 dark:hover:prose-a:text-sea-green-300 prose-strong:text-midnight-green-500 dark:prose-strong:text-parchment-500">
            <p className="text-xl text-midnight-green-400 dark:text-tea-green-400 leading-relaxed">
              {project.description}
            </p>
            {project.content && (
              <div dangerouslySetInnerHTML={{ __html: project.content }} />
            )}
          </div>
        </div>

        {/* Tags */}
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag, index) => (
              <span 
                key={index}
                className="px-3 py-1 text-sm bg-parchment-600 dark:bg-midnight-green-300 text-midnight-green-400 dark:text-tea-green-400 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}