"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { processQuillHtml } from "@/lib/quill-html-processor";

interface Writing {
  title: string;
  content: string;
  category: string;
  tags?: string[];
  createdAt: string;
  readingTime?: number;
  slug: string;
}

export default function WritingPage() {
  const { slug } = useParams();
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
      {/* Back Button */}
      <div className="mb-8">
        <Link href="/writings" className="inline-flex items-center text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200">
          <span className="text-lg">←</span>
          <span className="ml-2">Back to writings</span>
        </Link>
      </div>

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
