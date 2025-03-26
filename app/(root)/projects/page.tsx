"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";

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
  _id: string;
  title: string;
  slug: string;
  description: string;
  coverImage?: string;
  tags?: string[];
  category: string;
  link?: string;
  github?: string;
  isFeatured: boolean;
  createdAt: string;
  manualDate?: string;
  customLinks?: Array<{
    title: string;
    url: string;
    icon?: string;
  }>;
}

const itemsPerPage = 3;

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await axios.get("/api/projects");
        const fetchedProjects: Project[] = res.data.projects;

        // Sort projects: featured first, then by date
        const sortedProjects = [...fetchedProjects].sort((a, b) => {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

        setProjects(sortedProjects);

        // Generate unique categories and tags
        const uniqueCategories = ["All", ...new Set(fetchedProjects.map((p) => p.category))];
        setCategories(uniqueCategories);

        // Get all unique tags
        const tags = new Set<string>();
        fetchedProjects.forEach(project => {
          project.tags?.forEach(tag => tags.add(tag));
        });
        setAllTags(Array.from(tags));
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  // Filter & Paginate Projects
  const filteredProjects = projects.filter(project => {
    const matchesCategory = filter === "All" || project.category === filter;
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.every(tag => project.tags?.includes(tag));
    
    return matchesCategory && matchesSearch && matchesTags;
  });

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const paginatedProjects = filteredProjects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-base-100 text-base-content px-6 sm:px-12 md:px-24 py-12 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold text-green-600 mb-6">Projects</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300">
        A collection of things I&apos;ve built, designed, or experimented with. Some are finished, some are ongoing, and some are just ideas I started exploring.
      </p>

      {/* Search Bar */}
      <div className="mt-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-4 py-3 pl-12 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100 transition-colors"
          />
          <svg
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            width="20"
            height="20"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Categories</h3>
        <div className="overflow-x-auto whitespace-nowrap flex gap-4 pb-2 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                filter === category 
                  ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20" 
                  : "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
              }`}
              onClick={() => {
                setFilter(category);
                setCurrentPage(1);
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Tags */}
      {/* <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              className={`px-3 py-1 rounded-full text-sm transition-all duration-200 ${
                selectedTags.includes(tag)
                  ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                  : "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
              }`}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div> */}

      {/* Show Loading State */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Projects List */}
          <div className={`grid gap-6 mt-10 auto-rows-fr ${
            paginatedProjects.length === 1 
              ? 'grid-cols-1 max-w-3xl mx-auto' 
              : paginatedProjects.length === 2 
                ? 'grid-cols-1 md:grid-cols-2' 
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          }`}>
            {paginatedProjects.length > 0 ? (
              paginatedProjects.map((project) => (
                <Link key={project._id} href={`/projects/${project.slug}`} className="block h-full">
                  <div className="group h-full bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 transform hover:-translate-y-1">
                    {project.coverImage && (
                      <div className="relative w-full h-48 overflow-hidden">
                        <Image 
                          src={project.coverImage} 
                          alt={project.title} 
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    )}
                    
                    <div className="p-6 flex flex-col h-full">
                      <div className="flex items-start justify-between mb-3">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 group-hover:text-blue-500 transition-colors">
                          {project.title}
                        </h2>
                        <span className="px-2.5 py-0.5 text-xs font-medium bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
                          {project.category}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-300 line-clamp-2 mb-4 flex-grow">{project.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tags?.map((tag, index) => (
                          <span key={index} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700 mt-auto">
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <time>
                            {project.manualDate 
                              ? getRelativeDate(project.manualDate)
                              : getRelativeDate(project.createdAt)}
                          </time>
                        </div>
                        <div className="flex items-center gap-1 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300">
                          <span className="text-sm">View Case Study</span>
                          <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <p className="text-gray-500 dark:text-gray-400">No projects found matching your criteria.</p>
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setFilter('All');
                    setSelectedTags([]);
                    setCurrentPage(1);
                  }}
                  className="mt-4 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                    currentPage === page 
                      ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20" 
                      : "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                  }`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
