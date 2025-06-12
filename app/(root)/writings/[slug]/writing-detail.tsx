'use client';

import { useEffect, useState, useCallback } from "react";
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
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = useCallback(async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  }, []);

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

  useEffect(() => {
    if (!writing) return;

    // Add copy button to all pre elements containing code
    const codeBlocks = document.querySelectorAll('pre');
    codeBlocks.forEach((pre) => {
      const code = pre.querySelector('code');
      if (!code) return;

      // Only add button if it doesn't exist
      if (!pre.querySelector('.copy-code')) {
        const button = document.createElement('button');
        button.className = 'copy-code';
        button.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          <span>Copy</span>
        `;

        const codeText = code.textContent || '';
        button.onclick = () => {
          copyToClipboard(codeText);
          button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>Copied!</span>
          `;
          setTimeout(() => {
            button.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              <span>Copy</span>
            `;
          }, 2000);
        };
        pre.appendChild(button);
      }
    });
  }, [writing, copyToClipboard]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-primary-500 dark:text-accent-300">
          Loading article...
        </div>
      </div>
    );
  }

  if (error || !writing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error || 'Article not found'}</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <Link
          href="/writings"
          className="text-primary-600 hover:text-accent-500 dark:text-accent-300 dark:hover:text-accent-200"
        >
          Blog
        </Link>
        <span className="mx-2 text-primary-400 dark:text-accent-200/70">/</span>
        <span className="text-primary-600 dark:text-accent-300">{writing.title}</span>
      </nav>

      {/* Article Content */}
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-primary-500 dark:text-accent-300 mb-4">
            {writing.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-3 text-primary-500 dark:text-accent-200">
            <span className="px-2.5 py-0.5 bg-accent-100 text-accent-600 dark:bg-accent-900/30 dark:text-accent-300 rounded-full">
              {writing.category}
            </span>
            <span className="text-primary-400 dark:text-accent-200/70">•</span>
            <time>
              {new Date(writing.publishedAt || writing.createdAt).toLocaleDateString()}
            </time>
            {writing.readingTime && (
              <>
                <span className="text-primary-400 dark:text-accent-200/70">•</span>
                <span>{writing.readingTime} min read</span>
              </>
            )}
          </div>
        </div>

        {/* Cover Image */}
        {writing.coverImage && writing.coverImage.length > 0 && (
          <div className="relative w-full h-[500px] rounded-2xl overflow-hidden shadow-2xl">
            <Image 
              src={writing.coverImage} 
              alt={writing.title} 
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
              priority
            />
          </div>
        )}

        {/* Tags */}
        {writing.tags && writing.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {writing.tags.map((tag, index) => (
              <span 
                key={index} 
                className="px-3 py-1 text-sm bg-primary-100 dark:bg-rich-400 text-primary-600 dark:text-accent-200 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Article Content */}
        <div className="prose prose-lg max-w-none dark:prose-invert 
          prose-headings:text-primary-600 dark:prose-headings:text-accent-300
          prose-p:text-primary-500 dark:prose-p:text-accent-200/90
          prose-a:text-accent-600 dark:prose-a:text-accent-300 hover:prose-a:text-accent-700 dark:hover:prose-a:text-accent-200
          prose-strong:text-primary-600 dark:prose-strong:text-accent-300
          prose-code:text-primary-600 dark:prose-code:text-accent-300 prose-code:bg-primary-50 dark:prose-code:bg-rich-400
          prose-pre:bg-rich-500 dark:prose-pre:bg-rich-600
          prose-blockquote:border-accent-500 dark:prose-blockquote:border-accent-600 prose-blockquote:text-primary-500 dark:prose-blockquote:text-accent-200
          prose-ul:text-primary-500 dark:prose-ul:text-accent-200
          prose-ol:text-primary-500 dark:prose-ol:text-accent-200
          prose-li:text-primary-500 dark:prose-li:text-accent-200" 
          dangerouslySetInnerHTML={{ __html: processQuillHtml(writing.content) }} 
        />
      </div>
    </div>
  );
}