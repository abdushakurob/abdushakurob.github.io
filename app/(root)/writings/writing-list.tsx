'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { processQuillHtml } from "@/lib/quill-html-processor";

// Add relative date function
function getRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return "Today";
  } else if (diffDays === 1) {
    return "Yesterday";
  } else if (diffDays < 30) {
    return `${diffDays} days ago`;
  } else {
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    return `${month} ${year}`;
  }
}

interface Writing {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  tags?: string[];
  category: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  isDraft: boolean;
  status: 'draft' | 'published' | 'archived';
}

type ViewType = 'grid' | 'list';
type SortOption = 'newest' | 'oldest' | 'title';

interface TagCount {
  tag: string;
  count: number;
}

const itemsPerPage = 6;
const INITIAL_TAGS_TO_SHOW = 10;

export default function WritingList() {
  const [writings, setWritings] = useState<Writing[]>([]);
  const [filteredWritings, setFilteredWritings] = useState<Writing[]>([]);
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
  const [tagSearch, setTagSearch] = useState("");
  const [showTagsSection, setShowTagsSection] = useState(false);
  const [showCategoriesSection, setShowCategoriesSection] = useState(true);
  const [tagCounts, setTagCounts] = useState<TagCount[]>([]);
  const [showAllTags, setShowAllTags] = useState(false);

  useEffect(() => {
    fetchWritings();
  }, [currentPage]);

  useEffect(() => {
    if (writings.length > 0) {
      setIsFiltering(true);
      // Extract unique categories and calculate tag frequencies
      const cats = new Set(writings.map(w => w.category));
      const tagFrequency: Record<string, number> = {};
      
      writings.forEach(writing => {
        writing.tags?.forEach(tag => {
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

      // Filter and sort writings
      let filtered = [...writings];
      
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(writing => 
          writing.title.toLowerCase().includes(query) ||
          writing.content?.toLowerCase().includes(query) ||
          writing.tags?.some(tag => tag.toLowerCase().includes(query))
        );
      }

      if (selectedCategory !== "all") {
        filtered = filtered.filter(writing => writing.category === selectedCategory);
      }

      if (selectedTags.length > 0) {
        filtered = filtered.filter(writing => 
          selectedTags.every(tag => writing.tags?.includes(tag))
        );
      }

      // Sort writings
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

      setFilteredWritings(filtered);
      setIsFiltering(false);
    }
  }, [searchQuery, selectedCategory, selectedTags, sortBy, writings]);

  const fetchWritings = async () => {
    try {
      setError(null);
      const response = await axios.get('/api/writings');
      const newWritings = response.data.writings;
      
      setWritings(prevWritings => {
        if (currentPage === 1) return newWritings;
        return [...prevWritings, ...newWritings];
      });
      
      setHasMore(newWritings.length === itemsPerPage);
    } catch (err: any) {
      console.error('Error fetching writings:', err);
      setError('Failed to load writings');
      setWritings(currentPage === 1 ? [] : writings);
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
    if (!showAllTags && !tagSearch) {
      filtered = filtered.slice(0, INITIAL_TAGS_TO_SHOW);
    }
    return filtered;
  };

  if (loading && currentPage === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-600 dark:text-gray-400">
          Loading writings...
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary-500 dark:text-accent-800 mb-4">
          Brain Dumps & Learnings
        </h1>
        <p className="text-xl text-primary-600/80 dark:text-accent-300 max-w-2xl mx-auto">
          Random thoughts, notes-to-self, and things I learned the hard way.
          Consider it my public notebook—messy but maybe useful.
        </p>
      </div>

      {/* Control Panel */}
      <div className="mb-8 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search articles by title, content, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-primary-200 dark:border-primary-700 bg-surface-light dark:bg-rich-500 text-primary-600 dark:text-accent-300 focus:ring-2 focus:ring-accent-500 dark:focus:ring-accent-600 focus:border-transparent placeholder-primary-400 dark:placeholder-accent-200/50"
          />
          <svg
            className="absolute right-3 top-3.5 h-5 w-5 text-primary-400 dark:text-accent-300/50"
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
            <div className="flex items-center bg-surface-light dark:bg-rich-500 rounded-lg p-1">
              <button
                onClick={() => setViewType('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewType === 'grid'
                    ? 'bg-primary-100 dark:bg-rich-400 text-accent-600 dark:text-accent-300'
                    : 'text-primary-500 dark:text-accent-200 hover:text-accent-500 dark:hover:text-accent-300'
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
                    ? 'bg-primary-100 dark:bg-rich-400 text-accent-600 dark:text-accent-300'
                    : 'text-primary-500 dark:text-accent-200 hover:text-accent-500 dark:hover:text-accent-300'
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
              className="bg-surface-light dark:bg-rich-500 border border-primary-200 dark:border-primary-700 rounded-lg px-3 py-2 text-sm text-primary-600 dark:text-accent-300"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title A-Z</option>
            </select>
          </div>

          {/* Active Filters Display */}
          {(selectedCategory !== 'all' || selectedTags.length > 0 || searchQuery) && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-primary-500 dark:text-accent-300/70">
                {filteredWritings.length} results
              </span>
              <button
                onClick={clearFilters}
                className="text-accent-500 hover:text-accent-600 dark:text-accent-300 dark:hover:text-accent-200"
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
                {!tagSearch && tagCounts.length > INITIAL_TAGS_TO_SHOW && (
                  <button
                    onClick={() => setShowAllTags(!showAllTags)}
                    className="text-sm text-accent-500 hover:text-accent-600 dark:text-accent-300 dark:hover:text-accent-200"
                  >
                    {showAllTags ? 'Show Less' : `Show More (${tagCounts.length - INITIAL_TAGS_TO_SHOW} more)`}
                  </button>
                )}
              </div>
            )}
          </div> */}

          {/* Active Filters */}
          {(selectedCategory !== 'all' || selectedTags.length > 0) && (
            <div className="flex flex-wrap items-center gap-2 pt-4">
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
              <button
                onClick={clearFilters}
                className="text-sm text-accent-500 hover:text-accent-600 dark:text-accent-300 dark:hover:text-accent-200"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      {filteredWritings.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl text-primary-500 dark:text-accent-300">No matching articles found</h3>
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
            {filteredWritings.map((writing) => (
              <Link
                href={`/writings/${writing.slug}`}
                key={writing._id}
                className={`block group ${viewType === 'list' ? 'w-full' : ''}`}
              >
                <div className={`
                  bg-surface-light dark:bg-rich-500 rounded-xl shadow-sm hover:shadow-md 
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
                    {writing.coverImage ? (
                      <Image
                        src={writing.coverImage}
                        alt={writing.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-200"
                        sizes={viewType === 'list' 
                          ? "(max-width: 640px) 192px, 192px"
                          : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        }
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 text-primary-300 dark:text-rich-600">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className={`flex-1 ${viewType === 'list' ? 'flex flex-col' : ''}`}>
                    <div className="flex items-start justify-between gap-3">
                      <h2 className={`
                        font-semibold text-primary-600 dark:text-accent-300
                        group-hover:text-accent-500 dark:group-hover:text-accent-200 transition-colors
                        ${viewType === 'list' ? 'text-2xl line-clamp-1' : 'text-xl line-clamp-2'}
                      `}>
                        {writing.title}
                      </h2>
                    </div>

                    <p className={`
                      mt-2 text-primary-500/80 dark:text-accent-200/90
                      ${viewType === 'list' ? 'line-clamp-2' : 'line-clamp-3'}
                    `}>
                      {writing.excerpt || processQuillHtml(writing.content).slice(0, 150) + '...'}
                    </p>
                    
                    {writing.tags && writing.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {writing.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 text-xs bg-primary-100 dark:bg-rich-400 text-primary-600 dark:text-accent-200 rounded-full">
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
                      <span className="px-2.5 py-0.5 text-xs font-medium bg-accent-100 dark:bg-accent-900/30 text-accent-600 dark:text-accent-300 rounded-full">
                        {writing.category}
                      </span>
                      <time className="text-sm text-primary-400 dark:text-accent-200/70">
                        {getRelativeDate(writing.publishedAt || writing.createdAt)}
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