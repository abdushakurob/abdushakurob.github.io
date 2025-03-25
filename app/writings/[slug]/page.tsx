"use client"; // 

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // 
import Link from "next/link";
import axios from "axios";

interface Writing {
  title: string;
  content: string;
  category: string;
  createdAt: string;
  slug: string;
}

export default function WritingPage() {
  const { slug } = useParams(); // 
  const [writing, setWriting] = useState<Writing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWriting() {
      try {
        const res = await axios.get(`/api/writings/${slug}`);
        setWriting(res.data);
      } catch (error) {
        console.error("Failed to fetch writing:", error);
      } finally {
        setLoading(false);
      }
    }
    if (slug) fetchWriting();
  }, [slug]); // ✅ Runs when slug changes

  if (loading) return <p className="text-center">Loading...</p>;
  if (!writing) return <p className="text-center text-red-500">Post not found.</p>;

  return (
    <div className="min-h-screen bg-base-100 text-base-content px-6 sm:px-12 md:px-24 py-12 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold text-green-600 mb-4">{writing.title}</h1>
      <p className="text-gray-600">{writing.category} — {new Date(writing.createdAt).toDateString()}</p>
      <div className="mt-6 prose max-w-none" dangerouslySetInnerHTML={{ __html: writing.content }} />

      <div className="mt-10">
        <Link href="/writings" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          ← Back to Writings
        </Link>
      </div>
    </div>
  );
}
