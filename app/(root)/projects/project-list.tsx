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
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [viewType, setViewType] = useState<ViewType>('grid');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterSection, setShowFilterSection] = useState(false);
  
  // Category and tag state
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagCounts, setTagCounts] = useState<TagCount[]>([]);
  const [tagSearch, setTagSearch] = useState('');
  const [showAllTags, setShowAllTags] = useState(false);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  useEffect(() => {
    fetchProjects();
  }, [page]);

  useEffect(() => {
    if (projects.length > 0) {
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

      setCategories(Array.from(cats));
      setTagCounts(sortedTags);
      setTags(sortedTags.map(t => t.tag));

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

      if (selectedCategories.length > 0) {
        filtered = filtered.filter(project => 
          selectedCategories.includes(project.category)
        );
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
        
        switch (sortOption) {
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
    }
  }, [searchQuery, selectedCategories, selectedTags, sortOption, projects]);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('/api/projects');
      const newProjects = response.data.projects || [];
      
      setProjects(prevProjects => {
        if (page === 1) return newProjects;
        return [...prevProjects, ...newProjects];
      });
      
      setHasMore(newProjects.length === itemsPerPage);
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      setLoadingMore(true);
      setPage(prev => prev + 1);
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setSelectedTags([]);
    setSortOption('newest');
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

  if (loading && page === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-600 dark:text-gray-400">
          Loading projects...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Search Bar */}
      <div className="relative w-full mb-8">
        <input
          type="text"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 pl-12 text-midnight-green-500 dark:text-parchment-500 bg-parchment-500 dark:bg-midnight-green-400 border border-tea-green-300 dark:border-midnight-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sea-green-500 focus:border-transparent"
        />
        <svg
          className="absolute right-3 top-3.5 h-5 w-5 text-midnight-green-400 dark:text-tea-green-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Controls Row */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-8">
        {/* View Toggle & Sort */}
        <div className="flex items-center gap-4">
          {/* View Toggle */}
          <div className="flex items-center bg-parchment-600 dark:bg-midnight-green-400 rounded-lg p-1">
            <button
              onClick={() => setViewType('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewType === 'grid'
                  ? 'bg-white dark:bg-midnight-green-300 text-sea-green-500 dark:text-sea-green-400'
                  : 'text-midnight-green-400 dark:text-tea-green-400 hover:text-midnight-green-500 dark:hover:text-parchment-500'
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
                  ? 'bg-white dark:bg-midnight-green-300 text-sea-green-500 dark:text-sea-green-400'
                  : 'text-midnight-green-400 dark:text-tea-green-400 hover:text-midnight-green-500 dark:hover:text-parchment-500'
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
            className="px-3 py-2 bg-parchment-500 dark:bg-midnight-green-400 border border-tea-green-300 dark:border-midnight-green-300 rounded-lg text-midnight-green-500 dark:text-parchment-500 focus:outline-none focus:ring-2 focus:ring-sea-green-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="title">By Title</option>
          </select>
        </div>

        {/* Filter Section */}
        <div className="w-full sm:w-auto">
          <button
            onClick={() => setShowFilterSection(!showFilterSection)}
            className="w-full sm:w-auto px-4 py-2 flex items-center justify-between bg-parchment-600 dark:bg-midnight-green-400 text-midnight-green-500 dark:text-parchment-500 rounded-lg"
          >
            <span className="text-sm">Filter Projects</span>
            <svg
              className={`w-5 h-5 transform transition-transform ${showFilterSection ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showFilterSection && (
            <div className="mt-2 p-4 bg-parchment-500 dark:bg-midnight-green-400 rounded-lg border border-tea-green-300 dark:border-midnight-green-300">
              <div className="space-y-4">
                {/* Categories */}
                <div>
                  <h3 className="text-sm font-medium text-midnight-green-500 dark:text-parchment-500 mb-2">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => handleCategoryToggle(category)}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          selectedCategories.includes(category)
                            ? 'bg-sea-green-500 text-parchment-500'
                            : 'bg-parchment-600 text-midnight-green-400 dark:bg-midnight-green-300 dark:text-tea-green-400 hover:bg-sea-green-500/10'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <h3 className="text-sm font-medium text-midnight-green-500 dark:text-parchment-500 mb-2">Tags</h3>
                  <div className="relative mb-2">
                    <input
                      type="text"
                      placeholder="Search tags..."
                      value={tagSearch}
                      onChange={(e) => setTagSearch(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-parchment-600 dark:bg-midnight-green-300 text-midnight-green-500 dark:text-parchment-500 rounded-md border border-tea-green-300 dark:border-midnight-green-400 focus:outline-none focus:ring-2 focus:ring-sea-green-500"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {getFilteredTags()
                      .slice(0, showAllTags ? undefined : INITIAL_TAGS_TO_SHOW)
                      .map(({ tag, count }) => (
                        <button
                          key={tag}
                          onClick={() => handleTagToggle(tag)}
                          className={`group px-3 py-1 rounded-full text-sm transition-colors ${
                            selectedTags.includes(tag)
                              ? 'bg-sea-green-500 text-parchment-500'
                              : 'bg-parchment-600 text-midnight-green-400 dark:bg-midnight-green-300 dark:text-tea-green-400 hover:bg-sea-green-500/10'
                          }`}
                        >
                          <span>{tag}</span>
                          <span className="ml-1.5 px-1.5 py-0.5 text-xs rounded-full bg-parchment-500/20 dark:bg-midnight-green-500/20">
                            {count}
                          </span>
                        </button>
                      ))}
                  </div>
                  {tagCounts.length > INITIAL_TAGS_TO_SHOW && (
                    <button
                      onClick={() => setShowAllTags(!showAllTags)}
                      className="mt-2 text-sm text-sea-green-500 dark:text-sea-green-400 hover:underline"
                    >
                      {showAllTags ? 'Show Less' : 'Show All Tags'}
                    </button>
                  )}
                </div>

                {/* Clear Filters */}
                {(selectedCategories.length > 0 || selectedTags.length > 0) && (
                  <button
                    onClick={clearFilters}
                    className="mt-4 px-3 py-1 text-sm text-sea-green-500 dark:text-sea-green-400 hover:underline"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-sea-green-500 border-t-transparent"></div>
        </div>
      ) : (
        <>
          <div className={`grid gap-6 ${viewType === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : ''}`}>
            {filteredProjects.map((project) => (
              <Link
                key={project._id}
                href={`/projects/${project.slug}`}
                className={`
                  group block 
                  bg-parchment-500 dark:bg-midnight-green-400 rounded-xl shadow-sm hover:shadow-md 
                  transition-all duration-200 border border-tea-green-300 dark:border-midnight-green-300
                  ${viewType === 'list' 
                    ? 'flex gap-6 p-4 sm:p-6' 
                    : 'p-6 h-full'
                  }
                `}
              >
                <div className={`
                  relative rounded-lg overflow-hidden bg-parchment-600 dark:bg-midnight-green-300
                  ${viewType === 'list' 
                    ? 'w-48 h-32 flex-shrink-0' 
                    : 'w-full h-40 mb-4'
                  }
                `}>
                  {project.coverImage ? (
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
                      <div className="w-16 h-16 text-tea-green-400 dark:text-midnight-green-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>

                <div className={`flex-1 ${viewType === 'list' ? 'flex flex-col' : ''}`}>
                  <div className="flex items-start justify-between gap-3">
                    <h2 className={`
                      text-midnight-green-500 dark:text-parchment-500 font-semibold
                      group-hover:text-sea-green-500 dark:group-hover:text-sea-green-400 transition-colors
                      ${viewType === 'list' ? 'text-2xl line-clamp-1' : 'text-xl line-clamp-2'}
                    `}>
                      {project.title}
                    </h2>
                  </div>

                  <p className={`
                    mt-2 text-midnight-green-400 dark:text-tea-green-400
                    ${viewType === 'list' ? 'line-clamp-2' : 'line-clamp-3'}
                  `}>
                    {project.description}
                  </p>
                  
                  {project.tags && project.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 text-xs bg-parchment-600 dark:bg-midnight-green-300 text-midnight-green-400 dark:text-tea-green-400 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center mt-8">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="px-6 py-3 text-lg font-medium bg-sea-green-500 text-parchment-500 rounded-lg hover:bg-sea-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingMore ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}