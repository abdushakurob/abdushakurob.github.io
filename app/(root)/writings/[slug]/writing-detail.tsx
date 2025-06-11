'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
        setLoading(true);
        const { data } = await axios.get(`/api/writings/${slug}`);
        setWriting(data.writing);
      } catch (err) {
        console.error("Failed to fetch writing:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchWriting();
    }
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
        <p className="text-lg text-lapis-300 dark:text-tea-800/60">Loading post...</p>
      </div>
    );

  if (error || !writing)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <p className="text-xl text-red-500">Post not found or failed to load.</p>
        <Link href="/writings" 
              className="mt-4 text-verdigris-DEFAULT hover:text-verdigris-600 dark:text-verdigris-600 dark:hover:text-verdigris-500 hover:underline">
          ← Back to Writings
        </Link>
      </div>
    );

  return (
    <article className="min-h-screen bg-tea-900/50 dark:bg-lapis-200/50 text-lapis-DEFAULT dark:text-tea-800 px-6 sm:px-12 md:px-24 py-12 max-w-5xl mx-auto">
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

      <nav className="text-sm mb-8 flex items-center space-x-2">
        <Link href="/writings" 
              className="text-verdigris-DEFAULT hover:text-verdigris-600 dark:text-verdigris-600 dark:hover:text-verdigris-500">
          ← Back to Writings
        </Link>
      </nav>

      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-lapis-DEFAULT dark:text-lapis-700">
          {writing.title}
        </h1>
        
        <div className="flex flex-wrap gap-4 items-center text-sm text-lapis-400 dark:text-tea-800/80">
          <time dateTime={writing.publishedAt || writing.createdAt}>
            {new Date(writing.publishedAt || writing.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </time>
          <span>•</span>
          <span>{writing.readingTime} min read</span>
          {writing.category && (
            <>
              <span>•</span>
              <span className="px-2 py-1 bg-emerald-DEFAULT/10 text-emerald-DEFAULT dark:bg-emerald-600/10 dark:text-emerald-600 rounded-full text-xs">
                {writing.category}
              </span>
            </>
          )}
        </div>
      </header>

      {writing.coverImage && (
        <div className="relative w-full h-[400px] mb-8 rounded-xl overflow-hidden">
          <Image
            src={writing.coverImage}
            alt={writing.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <div 
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: processQuillHtml(writing.content) }}
      />

      {writing.tags && writing.tags.length > 0 && (
        <div className="mt-8 pt-8 border-t border-lapis-200/20 dark:border-tea-800/20">
          <div className="flex flex-wrap gap-2">
            {writing.tags.map((tag, index) => (
              <span 
                key={index} 
                className="px-3 py-1 text-sm bg-lapis-DEFAULT/5 dark:bg-tea-800/5 text-lapis-400 dark:text-tea-800 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}