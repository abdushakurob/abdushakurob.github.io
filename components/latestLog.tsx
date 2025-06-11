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
          .filter(writing => !writing.isDraft)
          .slice(0, 3); // Get only the latest 3 non-draft writings
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
    <section className="w-full py-16 border-b border-primary-200 dark:border-primary-700">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-primary-600 dark:text-accent-300">Latest Writings</h1>
        <p className="text-lg text-primary-600/80 dark:text-accent-200/90 mb-8">
          Thoughts, mistakes, and occasional realizations.
        </p>

        {/* Show Loading State */}
        {loading ? (
          <p className="text-center text-primary-400">Fetching latest writings...</p>
        ) : error ? (
          <p className="text-center text-accent-600 dark:text-accent-300">Failed to load writings.</p>
        ) : (
          <div className="space-y-6">
            {writings.length > 0 ? (
              writings.map((writing) => (
                <div key={writing.slug} className="flex justify-between items-center border-b border-primary-200 dark:border-primary-700 pb-4">
                  <div>
                    <Link href={`/writings/${writing.slug}`} 
                          className="text-lg font-medium text-primary-600 dark:text-accent-200 hover:text-accent-500 dark:hover:text-accent-300 transition-colors">
                      {writing.title}
                    </Link>
                    <p className="text-sm text-primary-400 dark:text-accent-200/70">{writing.category}</p>
                  </div>
                  <p className="text-sm text-primary-400 dark:text-accent-200/60 font-jetbrains-mono">
                    {new Date(writing.createdAt).toDateString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center text-primary-400 dark:text-accent-200/70">No writings available.</p>
            )}
          </div>
        )}

        {/* "View More Writings" Link */}
        <Link href="/writings" 
              className="inline-block mt-6 text-accent-500 hover:text-accent-600 dark:text-accent-300 dark:hover:text-accent-200 font-medium transition-colors">
          View More Writings →
        </Link>
      </div>
    </section>
  );
}
