"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { processQuillHtml } from "@/lib/quill-html-processor";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | Abdul Shakur',
  description: 'Articles, tutorials, and thoughts on web development, design, and technology.',
  openGraph: {
    title: 'Blog | Abdul Shakur',
    description: 'Articles, tutorials, and thoughts on web development, design, and technology.',
    type: 'website',
  },
};

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

interface Writing {
  _id: string;
  title: string;
  content: string;
  category: string;
  tags?: string[];
  slug: string;
  excerpt?: string;
  readingTime?: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  author: string;
  isDraft: boolean;
  coverImage?: string;
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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    headline: 'Blog | Abdul Shakur',
    description: 'Articles, tutorials, and thoughts on web development, design, and technology.',
    author: {
      '@type': 'Person',
      name: 'Abdul Shakur',
      url: 'https://abdushakur.me'
    },
    url: 'https://abdushakur.me/writings',
    inLanguage: 'en',
    blogPost: writings.map(post => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt || '',
      author: {
        '@type': 'Person',
        name: 'Abdul Shakur'
      },
      datePublished: post.publishedAt || post.createdAt,
      dateModified: post.updatedAt,
      url: `https://abdushakur.me/writings/${post.slug}`,
      ...(post.coverImage && {
        image: {
          '@type': 'ImageObject',
          url: post.coverImage
        }
      })
    }))
  };

  return (
    <div className="min-h-screen bg-base-100 text-base-content px-6 sm:px-12 md:px-24 py-12 max-w-5xl mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
          <div className="grid grid-cols-1 gap-8 mt-10">
            {paginatedWritings.length > 0 ? (
              paginatedWritings.map((writing) => (
                <Link key={writing.slug} href={`/writings/${writing.slug}`}>
                  <div className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
                    {writing.coverImage && (
                      <div className="relative w-full h-64 overflow-hidden">
                        <Image 
                          src={writing.coverImage} 
                          alt={writing.title} 
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    )}
                    
                    <div className="p-8">
                      <div className="flex items-start mb-4">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-500 transition-colors">
                          {writing.title}
                        </h2>
                        
                      </div>
                      
                      <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mb-4">
                        <time>{getRelativeDate(writing.createdAt)}</time>
                        {writing.readingTime && (
                          <>
                            <span>•</span>
                            <span>{writing.readingTime} min read</span>
                            
                          </>
                          
                        )}
                        <span>•</span>
                      <span className="px-3 py-1 text-sm font-medium bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
                          {writing.category}
                      </span>
                      </div>

                      <div className="prose prose-gray dark:prose-invert max-w-none mb-6">
                        <div dangerouslySetInnerHTML={{ 
                          __html: processQuillHtml(writing.excerpt || writing.content.substring(0, 500) + '...') 
                        }} />
                      </div>

                      {writing.tags && writing.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                          {writing.tags.map((tag, index) => (
                            <span key={index} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center text-blue-500 group-hover:text-blue-600 dark:text-blue-400 dark:group-hover:text-blue-300">
                        <span className="text-sm">Read full article</span>
                        <span className="ml-1 transform group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <p className="text-gray-500 dark:text-gray-400">No writings found matching your criteria.</p>
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
