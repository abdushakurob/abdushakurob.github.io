"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

interface Writing {
  _id: string;
  title: string;
  content: string;
  category: string;
  tags?: string[];
  coverImage?: string;
  author: string;
  isDraft: boolean;
  createdAt: string;
  updatedAt: string;
  slug: string;
  excerpt?: string;
  readingTime?: number;
}

const itemsPerPage = 6;

export default function Writings() {
  const [writings, setWritings] = useState<Writing[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [filter, setFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);

  useEffect(() => {
    async function fetchWritings() {
      try {
        const res = await axios.get("/api/writings");
        const fetchedWritings: Writing[] = res.data.writings;
        setWritings(fetchedWritings);

        // Extract unique categories and tags
        const uniqueCategories = ["All", ...new Set(fetchedWritings.map((post) => post.category))];
        setCategories(uniqueCategories);

        // Get all unique tags
        const tags = new Set<string>();
        fetchedWritings.forEach(writing => {
          writing.tags?.forEach(tag => tags.add(tag));
        });
        setAllTags(Array.from(tags));
      } catch (error) {
        console.error("Error fetching writings:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchWritings();
  }, []);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
    setCurrentPage(1);
  };

  // Filter writings
  const filteredWritings = writings
    .filter(writing => !writing.isDraft) // Filter out drafts
    .filter(writing => {
      const matchesCategory = filter === "All" || writing.category === filter;
      const matchesSearch = writing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (writing.excerpt?.toLowerCase() || "").includes(searchQuery.toLowerCase());
      const matchesTags = selectedTags.length === 0 || 
                         selectedTags.every(tag => writing.tags?.includes(tag));
      
      return matchesCategory && matchesSearch && matchesTags;
    });

  const totalPages = Math.ceil(filteredWritings.length / itemsPerPage);
  const paginatedWritings = filteredWritings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="min-h-screen bg-base-100 text-base-content px-6 sm:px-12 md:px-24 py-12 max-w-5xl mx-auto">
      {/* Page Header */}
      <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">Writings</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        A mix of raw thoughts, things that worked, and lessons learned.
      </p>

      {/* Search Bar */}
      <div className="mt-6">
        <input
          type="text"
          placeholder="Search writings..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Categories */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Categories</h3>
        <div className="overflow-x-auto whitespace-nowrap flex gap-4 pb-2">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-lg transition ${
                filter === category ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
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
      {allTags.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                className={`px-3 py-1 rounded-full text-sm transition ${
                  selectedTags.includes(tag)
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Show Loading State */}
      {loading ? (
        <p className="text-center text-gray-500 mt-10">Loading writings...</p>
      ) : (
        <>
          {/* Writings List */}
          <div className="grid md:grid-cols-2 gap-6 mt-10">
            {paginatedWritings.length > 0 ? (
              paginatedWritings.map((writing) => (
                <Link key={writing.slug} href={`/writings/${writing.slug}`}>
                  <div className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-start justify-between">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-500 transition-colors">
                        {writing.title}
                      </h2>
                      <span className="px-2.5 py-0.5 text-xs font-medium bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
                        {writing.category}
                      </span>
                    </div>
                    
                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <time>{new Date(writing.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</time>
                      {writing.readingTime && (
                        <>
                          <span>•</span>
                          <span>{writing.readingTime} min read</span>
                        </>
                      )}
                    </div>

                    <p className="mt-3 text-gray-600 dark:text-gray-300 line-clamp-2">
                      {writing.excerpt || writing.content.substring(0, 150)}...
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
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-center text-gray-500 col-span-2">No writings found matching your criteria.</p>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`px-4 py-2 rounded-lg transition ${
                    currentPage === page ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
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
