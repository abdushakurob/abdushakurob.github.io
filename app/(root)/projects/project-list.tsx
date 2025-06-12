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

type ViewType = 'grid' | 'list';
type SortOption = 'newest' | 'oldest' | 'title';

interface TagCount {
  tag: string;
  count: number;
}

const itemsPerPage = 3;
const INITIAL_TAGS_TO_SHOW = 10;

export default function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [categories, setCategories] = useState<Set<string>>(new Set());
  const [tags, setTags] = useState<Set<string>>(new Set());
  const [viewType, setViewType] = useState<ViewType>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);
  const [tagSearch, setTagSearch] = useState("");
  const [showTagsSection, setShowTagsSection] = useState(false);
  const [showCategoriesSection, setShowCategoriesSection] = useState(true);
  const [tagCounts, setTagCounts] = useState<TagCount[]>([]);

  useEffect(() => {
    fetchProjects();
  }, [currentPage]);

  useEffect(() => {
    if (projects.length > 0) {
      setIsFiltering(true);
      // Extract unique categories and calculate tag frequencies
      const cats = new Set(projects.map(p => p.category));
      const tagFrequency: Record<string, number> = {};
      
      projects.forEach(project => {
        project.tags?.forEach(tag => {
          tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
        });
      });

      // Convert to array and sort by frequency
      const sortedTags = Object.entries(tagFrequency)
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count);

      setCategories(cats);
      setTagCounts(sortedTags);
      setTags(new Set(sortedTags.map(t => t.tag)));

      // Filter and sort projects
      let filtered = [...projects];
      
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(project => 
          project.title.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query) ||
          project.tags?.some(tag => tag.toLowerCase().includes(query))
        );
      }

      if (selectedCategory !== "all") {
        filtered = filtered.filter(project => project.category === selectedCategory);
      }

      if (selectedTags.length > 0) {
        filtered = filtered.filter(project => 
          selectedTags.every(tag => project.tags?.includes(tag))
        );
      }

      // Sort projects
      filtered.sort((a, b) => {
        const dateA = new Date(a.publishedAt || a.createdAt).getTime();
        const dateB = new Date(b.publishedAt || b.createdAt).getTime();
        
        switch (sortBy) {
          case 'newest':
            return dateB - dateA;
          case 'oldest':
            return dateA - dateB;
          case 'title':
            return a.title.localeCompare(b.title);
          default:
            return dateB - dateA;
        }
      });

      setFilteredProjects(filtered);
      setIsFiltering(false);
    }
  }, [searchQuery, selectedCategory, selectedTags, sortBy, projects]);

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

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedTags([]);
    setSortBy('newest');
  };

  const getFilteredTags = () => {
    let filtered = tagCounts;
    if (tagSearch) {
      const search = tagSearch.toLowerCase();
      filtered = filtered.filter(({ tag }) => 
        tag.toLowerCase().includes(search)
      );
    }
    if (!showAllTags) {
      filtered = filtered.slice(0, INITIAL_TAGS_TO_SHOW);
    }
    return filtered;
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

  // Page Header and Controls
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary-600 dark:text-accent-200 mb-4">
          Things I've Built
        </h1>
        <p className="text-xl text-primary-500 dark:text-accent-200/90 max-w-2xl mx-auto">
          Some experiments, side projects, and things I've broken and fixed along the way.
          A mix of web apps, designs, and random ideas that turned into something.
        </p>
      </div>

      {/* Control Panel */}
      <div className="mb-8 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search projects by name, description, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-primary-200 dark:border-primary-700 bg-surface-100 dark:bg-surface-500 text-primary-600 dark:text-accent-200 focus:ring-2 focus:ring-primary-500 dark:focus:ring-accent-500 focus:border-transparent placeholder-primary-400 dark:placeholder-accent-200/60"
          />
          <svg
            className="absolute right-3 top-3.5 h-5 w-5 text-primary-400 dark:text-accent-300"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Controls Row */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          {/* View Toggle & Sort */}
          <div className="flex items-center gap-4">
            {/* View Toggle */}
            <div className="flex items-center bg-surface-100 dark:bg-surface-500 rounded-lg p-1 border border-primary-200 dark:border-primary-700">
              <button
                onClick={() => setViewType('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewType === 'grid'
                    ? 'bg-primary-100 dark:bg-surface-600 text-primary-600 dark:text-accent-200'
                    : 'text-primary-500 dark:text-accent-200/80 hover:text-accent-500 dark:hover:text-accent-300'
                }`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewType('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewType === 'list'
                    ? 'bg-primary-100 dark:bg-surface-600 text-primary-600 dark:text-accent-200'
                    : 'text-primary-500 dark:text-accent-200/80 hover:text-accent-500 dark:hover:text-accent-300'
                }`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-surface-100 dark:bg-surface-500 border border-primary-200 dark:border-primary-700 rounded-lg px-3 py-2 text-sm text-primary-600 dark:text-accent-200 focus:ring-2 focus:ring-primary-500 dark:focus:ring-accent-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title A-Z</option>
            </select>
          </div>

          {/* Active Filters Display */}
          {(selectedCategory !== 'all' || selectedTags.length > 0 || searchQuery) && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-primary-500 dark:text-accent-200/90">
                {filteredProjects.length} results
              </span>
              <button
                onClick={clearFilters}
                className="text-accent-500 hover:text-accent-600 dark:text-accent-300 dark:hover:text-accent-200 transition-colors"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* Filters Section */}
        <div className="space-y-4">
          {/* Categories Section */}
          {/* <div className="border border-primary-200 dark:border-primary-700 rounded-lg overflow-hidden">
            <button
              onClick={() => setShowCategoriesSection(!showCategoriesSection)}
              className="w-full px-4 py-3 flex items-center justify-between bg-surface-light dark:bg-rich-500 text-left"
            >
              <span className="font-medium text-primary-600 dark:text-accent-300">Categories</span>
              <svg
                className={`w-5 h-5 transform transition-transform ${
                  showCategoriesSection ? 'rotate-180' : ''
                } text-primary-500 dark:text-accent-300`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showCategoriesSection && (
              <div className="p-4 flex flex-wrap gap-2 bg-surface-light dark:bg-rich-500">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === "all"
                      ? "bg-accent-100 text-accent-600 dark:bg-accent-900/30 dark:text-accent-300"
                      : "bg-primary-100 text-primary-600 dark:bg-rich-400 dark:text-accent-200 hover:bg-primary-200 dark:hover:bg-rich-300"
                  }`}
                >
                  All Categories
                </button>
                {Array.from(categories).map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? "bg-accent-100 text-accent-600 dark:bg-accent-900/30 dark:text-accent-300"
                        : "bg-primary-100 text-primary-600 dark:bg-rich-400 dark:text-accent-200 hover:bg-primary-200 dark:hover:bg-rich-300"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div> */}

          {/* Tags Section */}
          {/* <div className="border border-primary-200 dark:border-primary-700 rounded-lg overflow-hidden">
            <button
              onClick={() => setShowTagsSection(!showTagsSection)}
              className="w-full px-4 py-3 flex items-center justify-between bg-surface-light dark:bg-rich-500 text-left"
            >
              <span className="font-medium text-primary-600 dark:text-accent-300">Tags</span>
              <svg
                className={`w-5 h-5 transform transition-transform ${
                  showTagsSection ? 'rotate-180' : ''
                } text-primary-500 dark:text-accent-300`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showTagsSection && (
              <div className="p-4 space-y-4 bg-surface-light dark:bg-rich-500">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search tags..."
                    value={tagSearch}
                    onChange={(e) => setTagSearch(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-md border border-primary-200 dark:border-primary-700 bg-white dark:bg-rich-400 text-primary-600 dark:text-accent-300 placeholder-primary-400 dark:placeholder-accent-200/50"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {getFilteredTags().map(({ tag, count }) => (
                    <button
                      key={tag}
                      onClick={() => handleTagToggle(tag)}
                      className={`group px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        selectedTags.includes(tag)
                          ? "bg-accent-100 text-accent-600 dark:bg-accent-900/30 dark:text-accent-300"
                          : "bg-primary-100 text-primary-600 dark:bg-rich-400 dark:text-accent-200 hover:bg-primary-200 dark:hover:bg-rich-300"
                      }`}
                    >
                      <span>{tag}</span>
                      <span className="ml-1.5 px-1.5 py-0.5 text-xs rounded-full bg-primary-200/50 dark:bg-rich-300/50 text-primary-600 dark:text-accent-200">
                        {count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div> */}

          {/* Active Filters */}
          {(selectedCategory !== 'all' || selectedTags.length > 0) && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-primary-500 dark:text-accent-300/70">Active filters:</span>
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-accent-100 text-accent-600 dark:bg-accent-900/30 dark:text-accent-300">
                  {selectedCategory}
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className="ml-1.5 hover:text-accent-700 dark:hover:text-accent-200"
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedTags.map(tag => (
                <span key={tag} className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-accent-100 text-accent-600 dark:bg-accent-900/30 dark:text-accent-300">
                  {tag}
                  <button
                    onClick={() => handleTagToggle(tag)}
                    className="ml-1.5 hover:text-accent-700 dark:hover:text-accent-200"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Project Grid/List */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl text-primary-500 dark:text-accent-300">No matching projects found</h3>
          <p className="mt-2 text-primary-400 dark:text-accent-200/70">Try adjusting your search or filter criteria</p>
          <button
            onClick={clearFilters}
            className="mt-4 text-accent-500 hover:text-accent-600 dark:text-accent-300 dark:hover:text-accent-200"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <>
          <div className={`
            transition-all duration-300 
            ${isFiltering ? 'opacity-50' : 'opacity-100'}
            ${viewType === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8'
              : 'space-y-6'
            }
          `}>
            {filteredProjects.map((project) => (
              <Link
                href={`/projects/${project.slug}`}
                key={project._id}
                className={`block group ${viewType === 'list' ? 'w-full' : ''}`}
              >
                <div className={`
                  bg-surface-100 dark:bg-surface-500 rounded-xl shadow-sm hover:shadow-md 
                  transition-all duration-200 border border-primary-200 dark:border-primary-700
                  ${viewType === 'list' 
                    ? 'flex gap-6 p-4 sm:p-6' 
                    : 'p-6 h-full'
                  }
                `}>
                  <div className={`
                    relative rounded-lg overflow-hidden bg-primary-100 dark:bg-rich-400
                    ${viewType === 'list' 
                      ? 'w-48 h-32 flex-shrink-0' 
                      : 'w-full h-40 mb-4'
                    }
                  `}>                  
                  {project.coverImage && project.coverImage.length > 0 ? (
                    <Image
                      src={project.coverImage}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                      sizes={viewType === 'list' 
                        ? "(max-width: 640px) 192px, 192px"
                        : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      }
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 text-primary-400 dark:text-surface-600">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                  )}
                  </div>

                  <div className={`flex-1 ${viewType === 'list' ? 'flex flex-col' : ''}`}>
                    <div className="flex items-start justify-between gap-3">
                      <h2 className={`
                        font-semibold text-primary-600 dark:text-accent-200
                        group-hover:text-accent-500 dark:group-hover:text-accent-300 transition-colors
                        ${viewType === 'list' ? 'text-2xl line-clamp-1' : 'text-xl line-clamp-2'}
                      `}>
                        {project.title}
                      </h2>
                      {project.isFeatured && (
                        <span className="flex-shrink-0 px-2.5 py-0.5 text-xs font-medium bg-accent-100 dark:bg-accent-800 text-accent-600 dark:text-accent-200 rounded-full">
                          Featured
                        </span>
                      )}
                    </div>

                    <p className={`
                      mt-2 text-primary-500 dark:text-accent-200/90
                      ${viewType === 'list' ? 'line-clamp-1' : 'line-clamp-2'}
                    `}>
                      {project.description}
                    </p>
                      {project.tags && project.tags.length > 0 && (
                      <div className={`mt-4 flex flex-wrap gap-2 ${viewType === 'list' ? 'mb-4' : ''}`}>
                        {project.tags.map((tag, index) => (
                          <span key={index} className="px-2.5 py-1 text-xs font-medium bg-primary-100 dark:bg-surface-600 text-primary-600 dark:text-accent-200 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className={`
                      mt-4 pt-4 border-t border-primary-200 dark:border-primary-700 
                      flex items-center justify-between
                      ${viewType === 'list' ? 'mt-auto' : ''}
                    `}>
                      <span className="px-2.5 py-0.5 text-xs font-medium bg-accent-100 dark:bg-accent-800 text-accent-600 dark:text-accent-200 rounded-full">
                        {project.category}
                      </span>
                      <time className="text-sm text-primary-500 dark:text-accent-200/80">
                        {getRelativeDate(project.createdAt)}
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
                className="px-6 py-3 text-lg font-medium bg-accent-500 hover:bg-accent-600 dark:bg-accent-600 dark:hover:bg-accent-500 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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