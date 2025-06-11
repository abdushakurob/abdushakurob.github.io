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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-primary-500 dark:text-accent-300">
          Loading project...
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error || 'Project not found'}</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <Link
          href="/projects"
          className="text-primary-600 hover:text-accent-500 dark:text-accent-300 dark:hover:text-accent-200"
        >
          Projects
        </Link>
        <span className="mx-2 text-primary-400 dark:text-accent-200/70">/</span>
        <span className="text-primary-600 dark:text-accent-300">{project.title}</span>
      </nav>

      {/* Project Details */}
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-primary-500 dark:text-accent-300 mb-4">{project.title}</h1>
          <div className="flex items-center gap-3 text-primary-500 dark:text-accent-200">
            <span className="px-2.5 py-0.5 bg-accent-100 text-accent-600 dark:bg-accent-900/30 dark:text-accent-300 rounded-full">
              {project.category}
            </span>
            <span className="text-primary-400 dark:text-accent-200/70">•</span>
            <time>
              {project.manualDate 
                ? new Date(project.manualDate).toLocaleDateString()
                : new Date(project.createdAt).toLocaleDateString()}
            </time>
          </div>
        </div>

        {/* Cover Image */}
        {project.coverImage && project.coverImage.length > 0 && (
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
        <div className="flex flex-wrap gap-4">
          {project.link && (
            <a 
              href={project.link.startsWith('http') ? project.link : `https://${project.link}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-accent-600 dark:text-accent-300 border border-accent-600 dark:border-accent-300 rounded-lg hover:bg-accent-50 dark:hover:bg-accent-900/30 transition-colors"
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
              className="inline-flex items-center gap-2 px-4 py-2 text-primary-600 dark:text-accent-200 border border-primary-300 dark:border-primary-700 rounded-lg hover:bg-primary-50 dark:hover:bg-rich-400 transition-colors"
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
              className="inline-flex items-center gap-2 px-4 py-2 text-primary-600 dark:text-accent-200 border border-primary-300 dark:border-primary-700 rounded-lg hover:bg-primary-50 dark:hover:bg-rich-400 transition-colors"
            >
              <span>{link.title}</span>
              <span>↗</span>
            </a>
          ))}
        </div>

        {/* Project Content */}
        <div>
          <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-primary-600 dark:prose-headings:text-accent-300 prose-p:text-primary-500 dark:prose-p:text-accent-200/90">
            <p className="text-xl text-primary-500 dark:text-accent-200 leading-relaxed">
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
                className="px-3 py-1 text-sm bg-primary-100 dark:bg-rich-400 text-primary-600 dark:text-accent-200 rounded-full"
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