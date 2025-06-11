'use client';
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";

// Add relative date function
function getRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  }
  if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30);
    return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  }
  const years = Math.floor(diffInDays / 365);
  return `${years} ${years === 1 ? 'year' : 'years'} ago`;
}

interface Project {
  _id: string;
  title: string;
  slug: string;
  description: string;
  coverImage?: string;
  category: string;
  tags?: string[];
  link?: string;
  github?: string;
  isFeatured: boolean;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

const itemsPerPage = 3;

export default function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, [currentPage]);

  const fetchProjects = async () => {
    try {
      setError(null);
      const response = await axios.get('/api/projects');
      const newProjects = response.data.projects || [];
      
      setProjects(prevProjects => {
        if (currentPage === 1) return newProjects;
        return [...prevProjects, ...newProjects];
      });
      
      setHasMore(newProjects.length === itemsPerPage);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects');
      setProjects(currentPage === 1 ? [] : projects); // Keep existing projects on error if not first page
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      setCurrentPage(prev => prev + 1);
    }
  };

  if (loading && currentPage === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-600 dark:text-gray-400">
          Loading projects...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {projects.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl text-gray-600 dark:text-gray-400">No projects published yet.</h3>
          <p className="mt-2 text-gray-500">Check back soon for new projects!</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {projects.map((project) => (
              <Link
                href={`/projects/${project.slug}`}
                key={project._id}
                className="block group"
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 dark:border-gray-700 h-full">
                  {project.coverImage && (
                    <div className="relative w-full h-40 mb-4 rounded-lg overflow-hidden">
                      <Image
                        src={project.coverImage}
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-200"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 group-hover:text-blue-500 transition-colors line-clamp-2">
                        {project.title}
                      </h2>
                      {project.isFeatured && (
                        <span className="flex-shrink-0 px-2.5 py-0.5 text-xs font-medium bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-gray-600 dark:text-gray-300 line-clamp-2">
                      {project.description}
                    </p>
                    
                    {project.tags && project.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {project.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                      <span className="px-2.5 py-0.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
                        {project.category}
                      </span>
                      <time className="text-sm text-gray-500 dark:text-gray-400">
                        {getRelativeDate(project.publishedAt || project.createdAt)}
                      </time>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {hasMore && (
            <div className="text-center mt-12">
              <button
                onClick={loadMore}
                disabled={loading}
                className="px-6 py-3 text-lg font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}