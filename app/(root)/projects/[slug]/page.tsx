"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { Metadata } from 'next';
import { 
  Code, 
  GithubIcon, 
  ExternalLink, 
  Link as LinkIcon, 
  Layers 
} from "lucide-react";
import { processQuillHtml } from "@/lib/quill-html-processor";
import { generateStructuredData, generateBreadcrumbData } from '@/lib/utils';

// Existing getRelativeDate function remains the same

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

interface Writing {
  _id: string;
  title: string;
  slug: string;
  description: string;
  tags?: string[];
  createdAt: string;
}

// Add generateMetadata function
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const res = await axios.get(`/api/projects/${params.slug}`);
    const project = res.data.project;
    
    return {
      title: `${project.title} | Abdul Shakur`,
      description: project.description,
      openGraph: {
        title: project.title,
        description: project.description,
        images: project.coverImage ? [project.coverImage] : [],
        type: 'article',
        authors: ['Abdul Shakur'],
      },
      twitter: {
        card: 'summary_large_image',
        title: project.title,
        description: project.description,
        images: project.coverImage ? [project.coverImage] : [],
      },
    };
  } catch (error) {
    return {
      title: 'Project | Abdul Shakur',
      description: 'Project details',
    };
  }
}

// Custom Link Button Component
const ProjectLinkButton = ({ 
  href, 
  icon, 
  children, 
  className = "" 
}: { 
  href: string, 
  icon: React.ReactNode, 
  children: React.ReactNode,
  className?: string
}) => (
  <a 
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`
      group relative inline-flex items-center gap-2 
      px-4 py-2 rounded-lg 
      transition-all duration-300 
      text-white text-sm
      transform hover:-translate-y-0.5 hover:scale-[1.02]
      focus:outline-none focus:ring-2 focus:ring-offset-2
      ${className}
    `}
  >
    <span className="absolute inset-0 bg-gradient-to-br opacity-75 group-hover:opacity-90 rounded-lg blur-sm group-hover:blur-md transition-all"></span>
    <span className="relative z-10 flex items-center gap-2">
      {icon}
      {children}
    </span>
  </a>
);

export default function ProjectPage() {
  const params = useParams();
  const slugParam = params.slug;
  const slug = Array.isArray(slugParam) ? slugParam[0] : slugParam;
  const [project, setProject] = useState<Project | null>(null);
  const [relatedWritings, setRelatedWritings] = useState<Writing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const jsonLd = project ? generateStructuredData({
    type: 'Project',
    title: project.title,
    description: project.description,
    coverImage: project.coverImage,
    datePublished: project.publishedAt || project.createdAt,
    dateModified: project.updatedAt,
    slug: slug || '',
    tags: project.tags
  }) : null;

  const breadcrumbData = project ? generateBreadcrumbData([
    { name: 'Home', item: '/' },
    { name: 'Projects', item: '/projects' },
    { name: project.title, item: `/projects/${slug}` }
  ]) : null;

  useEffect(() => {
    async function fetchProject() {
      try {
        setError(false);
        setLoading(true);
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

    if (slug) {
      fetchProject();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          {/* <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div> */}
          <p className="text-lg text-gray-600 dark:text-gray-400">Loading project...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white dark:from-red-900 dark:to-gray-800 flex flex-col items-center justify-center text-center p-6">
        <p className="text-xl text-red-500 mb-4">Project not found or failed to load.</p>
        <Link 
          href="/projects" 
          className="
            px-6 py-3 
            bg-red-500 text-white 
            rounded-lg 
            hover:bg-red-600 
            transition-colors 
            flex items-center gap-2
          "
        >
          <Layers size={18} />
          Back to Projects
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

      <div className="space-y-8">
        {/* Header Section */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            {project.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
            <span className="px-3 py-1 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
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

        {/* Project Links - Natural Layout */}
        <div className="flex flex-wrap gap-4">
          {project.link && (
            <a 
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex items-center gap-2 
                px-4 py-2 
                text-blue-600 dark:text-blue-400 
                hover:text-blue-700 dark:hover:text-blue-300 
                transition-colors
                border-b-2 border-transparent 
                hover:border-blue-500 
                dark:hover:border-blue-400
              "
            >
              <Code size={18} />
              <span>Visit Website</span>
            </a>
          )}
          {project.github && (
            <a 
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex items-center gap-2 
                px-4 py-2 
                text-gray-600 dark:text-gray-400 
                hover:text-gray-900 dark:hover:text-gray-200 
                transition-colors
                border-b-2 border-transparent 
                hover:border-gray-500 
                dark:hover:border-gray-400
              "
            >
              <GithubIcon size={18} />
              <span>View on GitHub</span>
            </a>
          )}
          {project.customLinks?.map((link, index) => (
            <a 
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex items-center gap-2 
                px-4 py-2 
                text-gray-600 dark:text-gray-400 
                hover:text-gray-900 dark:hover:text-gray-200 
                transition-colors
                border-b-2 border-transparent 
                hover:border-gray-500 
                dark:hover:border-gray-400
              "
            >
              {link.icon ? <span>{link.icon}</span> : <LinkIcon size={18} />}
              <span>{link.title}</span>
            </a>
          ))}
        </div>

        {/* Project Content */}
        <div 
          className="
            prose prose-lg max-w-none 
            dark:prose-invert 
            prose-headings:font-bold 
            prose-a:text-blue-500 
            prose-a:no-underline 
            hover:prose-a:underline
          " 
          dangerouslySetInnerHTML={{ __html: processQuillHtml(project.content || project.description) }} 
        />

        {/* Tags Section */}
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag, index) => (
              <span 
                key={index} 
                className="
                  px-3 py-1 
                  bg-gray-100 dark:bg-gray-700 
                  text-gray-600 dark:text-gray-300 
                  rounded-full text-sm 
                  hover:bg-blue-50 
                  dark:hover:bg-blue-900/30 
                  transition-colors
                "
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Related Writings Section */}
        {relatedWritings.length > 0 && (
          <div className="pt-12 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
              Related Writings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedWritings.map((writing) => (
                <Link 
                  key={writing.slug} 
                  href={`/writings/${writing.slug}`}
                  className="
                    group block p-6 
                    bg-white dark:bg-gray-800 
                    rounded-xl shadow-md 
                    hover:shadow-2xl 
                    transition-all duration-300 
                    border border-gray-100 
                    dark:border-gray-700 
                    hover:border-blue-200 
                    dark:hover:border-blue-900
                  "
                >
                  <h3 className="
                    font-semibold 
                    text-gray-900 dark:text-gray-100 
                    group-hover:text-blue-500 
                    transition-colors
                  ">
                    {writing.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {writing.description}
                  </p>
                  <div className="
                    mt-4 flex items-center 
                    text-blue-500 text-sm 
                    group-hover:text-blue-600 
                    transition-colors
                  ">
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