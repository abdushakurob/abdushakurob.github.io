'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { processQuillHtml } from "@/lib/quill-html-processor";
import { generateStructuredData, generateBreadcrumbData } from '@/lib/utils';

interface Writing {
  title: string;
  content: string;
  category: string;
  tags?: string[];
  excerpt?: string;
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  readingTime?: number;
  slug: string;
  seo?: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export default function WritingDetail({ slug }: { slug: string }) {
  const [writing, setWriting] = useState<Writing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchWriting() {
      try {
        setError(false);
        const res = await axios.get(`/api/writings/${slug}`);
        setWriting(res.data.writing);
      } catch (err) {
        console.error("Failed to fetch writing:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    if (slug) fetchWriting();
  }, [slug]);

  const jsonLd = writing ? generateStructuredData({
    type: 'BlogPosting',
    title: writing.title,
    description: writing.excerpt || writing.content.substring(0, 160),
    coverImage: writing.coverImage,
    datePublished: writing.publishedAt || writing.createdAt,
    dateModified: writing.updatedAt,
    slug: writing.slug,
    tags: writing.tags,
  }) : null;

  const breadcrumbData = writing ? generateBreadcrumbData([
    { name: 'Home', item: '/' },
    { name: 'Blog', item: '/writings' },
    { name: writing.title, item: `/writings/${writing.slug}` }
  ]) : null;

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-500">Loading post...</p>
      </div>
    );

  if (error || !writing)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <p className="text-xl text-red-500">Post not found or failed to load.</p>
        <Link href="/writings" className="mt-4 text-blue-500 hover:underline">
          ← Back to Writings
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-base-100 text-base-content px-6 sm:px-12 md:px-24 py-12 max-w-5xl mx-auto">
      {jsonLd && (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
          />
        </>
      )}
      {/* Back Button - Update to show breadcrumb navigation */}
      <nav className="mb-8 flex items-center text-sm">
        <Link 
          href="/"
          className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
        >
          Home
        </Link>
        <span className="mx-2 text-gray-500">/</span>
        <Link 
          href="/writings"
          className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
        >
          Blog
        </Link>
        <span className="mx-2 text-gray-500">/</span>
        <span className="text-gray-900 dark:text-gray-100">{writing.title}</span>
      </nav>

      {/* Writing Details */}
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">{writing.title}</h1>
          <div className="mt-2 flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
            <span className="px-2.5 py-0.5 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
              {writing.category}
            </span>
            <span>•</span>
            <time>
              {new Date(writing.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </time>
            {writing.readingTime && (
              <>
                <span>•</span>
                <span>{writing.readingTime} min read</span>
              </>
            )}
          </div>
        </div>

        {/* Tags */}
        {writing.tags && writing.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {writing.tags.map((tag, index) => (
              <span key={index} className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Writing Content */}
        <div className="prose prose-lg max-w-none dark:prose-invert" 
          dangerouslySetInnerHTML={{ __html: processQuillHtml(writing.content) }} />
      </div>
    </div>
  );
}