"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

interface Writing {
  title: string;
  category: string;
  createdAt: string;
  slug: string;
}

export default function LatestWritings() {
  const [writings, setWritings] = useState<Writing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchWritings() {
      try {
        const res = await axios.get("/api/writings");
        const fetchedWritings: Writing[] = res.data.slice(0, 3); // ✅ Get only the latest 3 writings
        setWritings(fetchedWritings);
      } catch (err) {
        console.error("Error fetching writings:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchWritings();
  }, []);

  return (
    <section className="w-full py-16 border-b border-gray-300 dark:border-gray-700">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Latest Writings</h1> {/* Changed from "Log Updates" */}
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Thoughts, mistakes, and occasional realizations. No grand lessons—just things I&apos;ve noticed.
        </p>

        {/* Show Loading State */}
        {loading ? (
          <p className="text-center text-gray-500">Fetching latest writings...</p>
        ) : error ? (
          <p className="text-center text-red-500">Failed to load writings.</p>
        ) : (
          <div className="space-y-6">
            {writings.length > 0 ? (
              writings.map((writing) => (
                <div key={writing.slug} className="flex justify-between items-center border-b pb-4">
                  <div>
                    {/* ✅ Title is clickable now */}
                    <Link href={`/writings/${writing.slug}`} className="text-lg font-medium hover:text-blue-600">
                      {writing.title}
                    </Link>
                    <p className="text-sm text-gray-500">{writing.category}</p>
                  </div>
                  <p className="text-sm text-gray-400 font-jetbrains-mono">
                    {new Date(writing.createdAt).toDateString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No writings available.</p>
            )}
          </div>
        )}

        {/* ✅ "View More Writings" Link */}
        <Link href="/writings" className="inline-block mt-6 text-blue-600 dark:text-blue-400 font-medium">
          View More Writings →
        </Link>
      </div>
    </section>
  );
}
