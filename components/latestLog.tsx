"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

interface Writing {
  title: string;
  category: string;
  createdAt: string;
  slug: string;
  isDraft: boolean;
}

export default function LatestWritings() {
  const [writings, setWritings] = useState<Writing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchWritings() {
      try {
        const res = await axios.get("/api/writings");
        const fetchedWritings: Writing[] = res.data.writings
          .filter((w) => !w.isDraft)
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 3); // Only latest 3
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
    <section className="w-full py-16 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-4 tracking-tight text-gray-900 dark:text-white">
          Latest Writings
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-10">
          Thoughts, mistakes, and occasional realizations.
        </p>

        {loading ? (
          <p className="text-center text-gray-500">Fetching latest writings...</p>
        ) : error ? (
          <p className="text-center text-red-500">
            Something went wrong. Please try again later.
          </p>
        ) : writings.length > 0 ? (
          <div className="space-y-8">
            {writings.map((writing) => (
              <div
                key={writing.slug}
                className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-gray-200 dark:border-gray-700 pb-5"
              >
                <div>
                  <Link
                    href={`/writings/${writing.slug}`}
                    className="text-xl font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition"
                  >
                    {writing.title}
                  </Link>
                  <div className="mt-1">
                    <span className="inline-block text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded">
                      {writing.category}
                    </span>
                  </div>
                </div>
                <p className="mt-3 sm:mt-0 text-sm text-gray-500 dark:text-gray-400 font-mono">
                  {new Date(writing.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No writings available yet.</p>
        )}

        <div className="mt-10 text-center">
          <Link
            href="/writings"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium hover:underline"
          >
            View More Writings →
          </Link>
        </div>
      </div>
    </section>
  );
}
