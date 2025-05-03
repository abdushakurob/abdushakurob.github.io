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
    <div className="max-w-5xl mx-auto px-6 py-12">
      {writings.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl text-gray-600 dark:text-gray-400">No writings published yet.</h3>
          <p className="mt-2 text-gray-500">Check back soon for new content!</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {writings.map((writing) => (
              <Link
                href={`/writings/${writing.slug}`}
                key={writing._id}
                className="group flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:-translate-y-1"
              >
                {writing.coverImage && (
                  <div className="relative w-full h-48">
                    <Image
                      src={writing.coverImage}
                      alt={writing.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {writing.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 flex-1">
                    {writing.excerpt || processQuillHtml(writing.content).substring(0, 150)}...
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>{writing.category}</span>
                    <time>{getRelativeDate(writing.publishedAt || writing.createdAt)}</time>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {hasMore && (
            <div className="mt-8 text-center">
              <button
                onClick={loadMore}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
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