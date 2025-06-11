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
    <section className="w-full py-16 bg-gradient-to-b from-transparent to-surface-light/50 dark:to-rich-500/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4 text-primary-500 dark:text-accent-300">Writings</h1>
          <p className="text-lg text-primary-600/90 dark:text-accent-200/90 max-w-2xl">
            Thoughts, tutorials, and insights about web development, design, and technology.
          </p>
        </div>

        {/* Main grid layout */}
        <div className="lg:grid lg:grid-cols-12 gap-8">
          {/* Sidebar with filters */}
          <aside className="lg:col-span-3 mb-8 lg:mb-0 space-y-6">
            {/* Search */}
            <div className="bg-surface-light dark:bg-rich-500 p-4 rounded-xl border border-primary-200/50 dark:border-primary-700/50">
              <label className="block text-sm font-medium text-primary-600 dark:text-accent-300 mb-2">
                Search Writings
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-rich-400 border border-primary-300/50 dark:border-primary-600/50 text-primary-600 dark:text-accent-200 placeholder:text-primary-400 dark:placeholder:text-accent-200/50 focus:outline-none focus:ring-2 focus:ring-accent-500/50"
              />
            </div>

            {/* Categories */}
            <div className="bg-surface-light dark:bg-rich-500 p-4 rounded-xl border border-primary-200/50 dark:border-primary-700/50">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-primary-600 dark:text-accent-300">Categories</h3>
                <button
                  onClick={() => setShowCategoriesSection(!showCategoriesSection)}
                  className="text-accent-500 dark:text-accent-300 hover:text-accent-600 dark:hover:text-accent-200"
                >
                  {showCategoriesSection ? '−' : '+'}
                </button>
              </div>
              {showCategoriesSection && (
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      selectedCategory === "all"
                        ? "bg-accent-500 text-white dark:bg-accent-600"
                        : "text-primary-600 dark:text-accent-200 hover:bg-primary-100 dark:hover:bg-rich-400"
                    }`}
                  >
                    All Categories
                  </button>
                  {Array.from(categories).map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        selectedCategory === category
                          ? "bg-accent-500 text-white dark:bg-accent-600"
                          : "text-primary-600 dark:text-accent-200 hover:bg-primary-100 dark:hover:bg-rich-400"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="bg-surface-light dark:bg-rich-500 p-4 rounded-xl border border-primary-200/50 dark:border-primary-700/50">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-primary-600 dark:text-accent-300">Tags</h3>
                <button
                  onClick={() => setShowTagsSection(!showTagsSection)}
                  className="text-accent-500 dark:text-accent-300 hover:text-accent-600 dark:hover:text-accent-200"
                >
                  {showTagsSection ? '−' : '+'}
                </button>
              </div>
              {showTagsSection && (
                <>
                  <input
                    type="text"
                    value={tagSearch}
                    onChange={(e) => setTagSearch(e.target.value)}
                    placeholder="Search tags..."
                    className="w-full px-3 py-1.5 mb-2 rounded-lg bg-white/50 dark:bg-rich-400 border border-primary-300/50 dark:border-primary-600/50 text-primary-600 dark:text-accent-200 placeholder:text-primary-400 dark:placeholder:text-accent-200/50 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/50"
                  />
                  <div className="flex flex-wrap gap-2">
                    {tagCounts
                      .filter(({ tag }) => 
                        tag.toLowerCase().includes(tagSearch.toLowerCase())
                      )
                      .slice(0, showAllTags ? undefined : INITIAL_TAGS_TO_SHOW)
                      .map(({ tag, count }) => (
                        <button
                          key={tag}
                          onClick={() => {
                            setSelectedTags(
                              selectedTags.includes(tag)
                                ? selectedTags.filter((t) => t !== tag)
                                : [...selectedTags, tag]
                            );
                          }}
                          className={`px-2 py-1 text-xs rounded-full transition-colors ${
                            selectedTags.includes(tag)
                              ? "bg-accent-500 text-white dark:bg-accent-600"
                              : "bg-primary-100 text-primary-600 dark:bg-rich-600 dark:text-accent-200 border border-primary-200 dark:border-primary-600"
                          }`}
                        >
                          {tag} ({count})
                        </button>
                      ))}
                    {tagCounts.length > INITIAL_TAGS_TO_SHOW && (
                      <button
                        onClick={() => setShowAllTags(!showAllTags)}
                        className="text-sm text-accent-500 dark:text-accent-300 hover:text-accent-600 dark:hover:text-accent-200"
                      >
                        {showAllTags ? "Show Less" : "Show More"}
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </aside>

          {/* Main content area */}
          <main className="lg:col-span-9">
            {/* View options and sort */}
            <div className="flex justify-between items-center mb-6 bg-surface-light dark:bg-rich-500 p-4 rounded-xl border border-primary-200/50 dark:border-primary-700/50">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setViewType("grid")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewType === "grid"
                      ? "bg-accent-500 text-white dark:bg-accent-600"
                      : "text-primary-600 dark:text-accent-200 hover:bg-primary-100 dark:hover:bg-rich-400"
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewType("list")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewType === "list"
                      ? "bg-accent-500 text-white dark:bg-accent-600"
                      : "text-primary-600 dark:text-accent-200 hover:bg-primary-100 dark:hover:bg-rich-400"
                  }`}
                >
                  List
                </button>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-4 py-2 rounded-lg bg-white/50 dark:bg-rich-400 border border-primary-300/50 dark:border-primary-600/50 text-primary-600 dark:text-accent-200 focus:outline-none focus:ring-2 focus:ring-accent-500/50"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">By Title</option>
              </select>
            </div>

            {/* Writings grid/list */}
            {loading ? (
              <div className="text-center py-12">
                <p className="text-primary-500 dark:text-accent-300 animate-pulse">Loading writings...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-accent-600 dark:text-accent-300">{error}</p>
              </div>
            ) : filteredWritings.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-primary-500 dark:text-accent-300">No writings found matching your criteria.</p>
              </div>
            ) : (
              <div className={`${
                viewType === "grid" 
                  ? "grid grid-cols-1 md:grid-cols-2 gap-6" 
                  : "space-y-6"
              }`}>
                {/* Writing cards */}
                {filteredWritings.map((writing) => (
                  <Link
                    key={writing._id}
                    href={`/writings/${writing.slug}`}
                    className={`block group ${
                      viewType === "grid"
                        ? "h-full"
                        : "flex gap-6 items-start"
                    }`}
                  >
                    <article className={`h-full bg-surface-light dark:bg-rich-500 rounded-xl border border-primary-200/50 dark:border-primary-700/50 overflow-hidden transition-all duration-300 hover:shadow-lg ${
                      viewType === "grid"
                        ? ""
                        : "flex gap-6"
                    }`}>
                      {writing.coverImage && (
                        <div className={`relative ${
                          viewType === "grid"
                            ? "h-48"
                            : "w-48 h-32"
                        }`}>
                          <Image
                            src={writing.coverImage}
                            alt={writing.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <h2 className="text-xl font-bold text-primary-600 dark:text-accent-300 group-hover:text-accent-500 dark:group-hover:text-accent-200 transition-colors">
                            {writing.title}
                          </h2>
                          <span className="px-3 py-1 text-xs rounded-full whitespace-nowrap bg-accent-100 text-accent-600 dark:bg-accent-500/10 dark:text-accent-300">
                            {writing.category}
                          </span>
                        </div>
                        {writing.excerpt && (
                          <p className="text-primary-600/80 dark:text-accent-200/80 line-clamp-2 mb-4">
                            {writing.excerpt}
                          </p>
                        )}
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex flex-wrap gap-2">
                            {writing.tags?.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 text-xs rounded-full bg-primary-100 text-primary-600 dark:bg-rich-600 dark:text-accent-200 border border-primary-200 dark:border-primary-600"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <time className="text-sm text-primary-500/70 dark:text-accent-200/60 font-mono">
                            {getRelativeDate(writing.createdAt)}
                          </time>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}

            {/* Load more button */}
            {hasMore && !isFiltering && (
              <div className="text-center mt-12">
                <button
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white dark:bg-accent-600 dark:hover:bg-accent-500 rounded-lg transition-colors"
                >
                  Load More
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </section>
  );
}