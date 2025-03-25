"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import Head from "next/head";

interface Writing {
  title: string;
  content: string;
  category: string;
  createdAt: string;
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
        setError(false); // Reset error state
        const res = await axios.get(`/api/writings/${slug}`);
        setWriting(res.data.writing); // ✅ Fix: Access 'writing' inside response
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
      {/* Dynamic Page Title */}
      <Head>
        <title>{writing.title} | Abdushakur</title>
      </Head>

      {/* Blog Content */}
      <h1 className="text-4xl font-bold text-green-600 mb-2">{writing.title}</h1>
      <p className="text-gray-600 text-sm">
        {writing.category} • {new Date(writing.createdAt).toDateString()}
      </p>

      <div className="mt-6 prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-green-600 prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-li:marker:text-blue-500 prose-a:text-blue-500 prose-a:underline prose-code:text-red-500 prose-code:bg-gray-100 prose-code:p-1 prose-code:rounded prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 prose-blockquote:italic" dangerouslySetInnerHTML={{ __html: writing.content }} />

      {/* Back Button */}
      <div className="mt-10">
        <Link href="/writings" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          ← Back to Writings
        </Link>
      </div>
    </div>
  );
}
