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

  return (
    <div className="w-full py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4 text-lapis-DEFAULT dark:text-lapis-700">
            Projects & Experiments
          </h1>
          <p className="text-lg text-lapis-400 dark:text-tea-800">
            A collection of things I&apos;ve built, from small experiments to larger projects.
          </p>
        </div>

        {/* Project Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-lg text-lapis-300 dark:text-tea-800/60">Loading projects...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-lg text-red-500">{error}</p>
          </div>
        ) : (
          <>
            {/* Filters */}
            <div className="mb-8 space-y-4">
              {/* View Toggle */}
              <div className="flex gap-4">
                <button
                  onClick={() => setViewType('grid')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    viewType === 'grid' 
                      ? 'bg-lapis-DEFAULT text-white dark:bg-lapis-700' 
                      : 'text-lapis-400 dark:text-tea-800 hover:bg-lapis-DEFAULT/10 dark:hover:bg-tea-800/10'
                  }`}
                >
                  Grid View
                </button>
                <button
                  onClick={() => setViewType('list')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    viewType === 'list'
                      ? 'bg-lapis-DEFAULT text-white dark:bg-lapis-700'
                      : 'text-lapis-400 dark:text-tea-800 hover:bg-lapis-DEFAULT/10 dark:hover:bg-tea-800/10'
                  }`}
                >
                  List View
                </button>
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {Array.from(categories).map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1.5 rounded-lg transition-colors ${
                      selectedCategory === category
                        ? 'bg-lapis-DEFAULT text-white dark:bg-lapis-700'
                        : 'border border-lapis-200 dark:border-tea-800 text-lapis-400 dark:text-tea-800 hover:bg-lapis-DEFAULT/10 dark:hover:bg-tea-800/10'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Tag Filter */}
              <div className="flex flex-wrap gap-2">
                {Array.from(tags).map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      if (selectedTags.includes(tag)) {
                        setSelectedTags(selectedTags.filter(t => t !== tag));
                      } else {
                        setSelectedTags([...selectedTags, tag]);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-lg transition-colors ${
                      selectedTags.includes(tag)
                        ? 'bg-emerald-DEFAULT/10 text-emerald-DEFAULT dark:bg-emerald-600/10 dark:text-emerald-600'
                        : 'border border-lapis-200 dark:border-tea-800 text-lapis-400 dark:text-tea-800 hover:bg-lapis-DEFAULT/10 dark:hover:bg-tea-800/10'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Projects Grid/List */}
            <div className={viewType === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-8'}>
              {filteredProjects.map((project) => (
                <Link key={project._id} href={`/projects/${project.slug}`}>
                  <div className={`group ${
                    viewType === 'grid'
                      ? 'bg-tea-900/50 dark:bg-lapis-200/50 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-lapis-200/10 dark:border-tea-800/10'
                      : 'flex gap-6 items-start p-6 rounded-xl hover:bg-tea-900/50 dark:hover:bg-lapis-200/50 transition-colors'
                  }`}>
                    {project.coverImage && (
                      <div className={`relative ${
                        viewType === 'grid' ? 'w-full h-48 mb-4' : 'w-48 h-32'
                      } rounded-lg overflow-hidden`}>
                        <Image
                          src={project.coverImage}
                          alt={project.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                    )}
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-xl font-semibold text-lapis-DEFAULT dark:text-tea-800 group-hover:text-verdigris-DEFAULT dark:group-hover:text-verdigris-600 transition-colors">
                          {project.title}
                        </h3>
                        <span className="px-2.5 py-0.5 text-xs font-medium bg-emerald-DEFAULT/10 text-emerald-DEFAULT dark:bg-emerald-600/10 dark:text-emerald-600 rounded-full">
                          {project.category}
                        </span>
                      </div>
                      <p className="mt-2 text-lapis-400 dark:text-tea-800/80 line-clamp-2">
                        {project.description}
                      </p>
                      {project.tags && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {project.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs bg-lapis-DEFAULT/5 dark:bg-tea-800/5 text-lapis-400 dark:text-tea-800 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center mt-12">
                <button
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="px-6 py-3 bg-lapis-DEFAULT hover:bg-lapis-600 dark:bg-lapis-700 dark:hover:bg-lapis-600 text-white rounded-lg transition-colors"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}