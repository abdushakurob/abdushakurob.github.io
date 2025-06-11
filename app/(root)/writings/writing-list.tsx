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

const itemsPerPage = 6;

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

  useEffect(() => {
    fetchWritings();
  }, [currentPage]);

  useEffect(() => {
    if (writings.length > 0) {
      setIsFiltering(true);
      // Extract unique categories and tags
      const cats = new Set(writings.map(w => w.category));
      const tagSet = new Set<string>();
      writings.forEach(w => w.tags?.forEach(tag => tagSet.add(tag)));
      
      setCategories(cats);
      setTags(tagSet);

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
      console.log('Fetching writings...');
      const response = await axios.get('/api/writings');
      console.log('Response:', response.data);
      const newWritings = response.data.writings;
      
      if (!Array.isArray(newWritings)) {
        throw new Error('Invalid response format: writings is not an array');
      }
      
      setWritings(prevWritings => {
        if (currentPage === 1) return newWritings;
        return [...prevWritings, ...newWritings];
      });
      
      setHasMore(newWritings.length === itemsPerPage);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to load writings';
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      setError(errorMessage);
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
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Writings & Articles
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Thoughts, tutorials, and insights on web development, design, and technology.
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
            className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
          />
          <svg
            className="absolute right-3 top-3.5 h-5 w-5 text-gray-400 dark:text-gray-500"
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
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setViewType('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewType === 'grid'
                    ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
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
                    ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
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
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title A-Z</option>
            </select>
          </div>

          {/* Active Filters Display */}
          {(selectedCategory !== 'all' || selectedTags.length > 0 || searchQuery) && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                {filteredWritings.length} results
              </span>
              <button
                onClick={clearFilters}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* Filters Section */}
        <div className="space-y-4">
          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === "all"
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                  : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
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
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {Array.from(tags).map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedTags.includes(tag)
                    ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Section */}
      {filteredWritings.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl text-gray-600 dark:text-gray-400">No matching articles found</h3>
          <p className="mt-2 text-gray-500">Try adjusting your search or filter criteria</p>
          <button
            onClick={clearFilters}
            className="mt-4 text-blue-600 dark:text-blue-400 hover:underline"
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
                  bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md 
                  transition-all duration-200 border border-gray-100 dark:border-gray-700
                  ${viewType === 'list' 
                    ? 'flex gap-6 p-4 sm:p-6' 
                    : 'p-6 h-full'
                  }
                `}>
                  <div className={`
                    relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700
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
                        <div className="w-16 h-16 text-gray-300 dark:text-gray-600">
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
                        font-semibold text-gray-800 dark:text-gray-100 
                        group-hover:text-blue-500 transition-colors
                        ${viewType === 'list' ? 'text-2xl line-clamp-1' : 'text-xl line-clamp-2'}
                      `}>
                        {writing.title}
                      </h2>
                    </div>

                    <p className={`
                      mt-2 text-gray-600 dark:text-gray-300
                      ${viewType === 'list' ? 'line-clamp-2' : 'line-clamp-3'}
                    `}>
                      {writing.excerpt || processQuillHtml(writing.content).slice(0, 150) + '...'}
                    </p>
                    
                    {writing.tags && writing.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {writing.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className={`
                      mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 
                      flex items-center justify-between
                      ${viewType === 'list' ? 'mt-auto' : ''}
                    `}>
                      <span className="px-2.5 py-0.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
                        {writing.category}
                      </span>
                      <time className="text-sm text-gray-500 dark:text-gray-400">
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