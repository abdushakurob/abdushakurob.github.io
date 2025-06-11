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
    <div className="min-h-screen bg-base-100 text-base-content px-6 sm:px-12 md:px-24 py-12 max-w-5xl mx-auto">
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
      {/* Back Button - Update to show breadcrumb navigation */}
      <nav className="mb-8 flex items-center text-sm">
        <Link 
          href="/"
          className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
        >
          Home
        </Link>
        <span className="mx-2 text-gray-500">/</span>
        <Link 
          href="/projects"
          className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
        >
          Projects
        </Link>
        <span className="mx-2 text-gray-500">/</span>
        <span className="text-gray-900 dark:text-gray-100">{project.title}</span>
      </nav>

      {/* Project Details */}
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">{project.title}</h1>
          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
            <span className="px-2.5 py-0.5 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
              {project.category}
            </span>
            <span>•</span>
            <time>
              {project.manualDate 
                ? new Date(project.manualDate).toLocaleDateString()
                : new Date(project.createdAt).toLocaleDateString()}
            </time>
          </div>
        </div>

        {/* Cover Image */}
        {project.coverImage && (
          <div className="relative w-full h-[500px] rounded-2xl overflow-hidden shadow-2xl">
            <Image 
              src={project.coverImage} 
              alt={project.title} 
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
              priority
            />
          </div>
        )}

        {/* Project Links */}
        <div className="flex flex-wrap gap-4">          {project.link && (
            <a 
              href={project.link.startsWith('http') ? project.link : `https://${project.link}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
            >
              <span>View Live</span>
              <span>↗</span>
            </a>
          )}
          
          {project.github && (
            <a 
              href={project.github.startsWith('http') ? project.github : `https://${project.github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
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
              className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <span>{link.title}</span>
              <span>↗</span>
            </a>
          ))}
        </div>

        {/* Project Content */}
        <div>
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
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
                className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full"
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