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

const itemsPerPage = 6;

export default function WritingList() {
  const [writings, setWritings] = useState<Writing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchWritings();
  }, [currentPage]);

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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {writings.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl text-gray-600 dark:text-gray-400">No writings published yet.</h3>
          <p className="mt-2 text-gray-500">Check back soon for new content!</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {writings.map((writing) => (
              <Link
                href={`/writings/${writing.slug}`}
                key={writing._id}
                className="block group"
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 dark:border-gray-700 h-full">
                  {writing.coverImage && (
                    <div className="relative w-full h-40 mb-4 rounded-lg overflow-hidden">
                      <Image
                        src={writing.coverImage}
                        alt={writing.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-200"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  <div>
                    <div className="flex items-start justify-between">
                      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 group-hover:text-blue-500 transition-colors line-clamp-2">
                        {writing.title}
                      </h2>
                    </div>
                    <p className="mt-2 text-gray-600 dark:text-gray-300 line-clamp-3">
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

                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
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