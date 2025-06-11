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
          .filter((writing) => !writing.isDraft)
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
    <section className="mt-16">
      <h2 className="text-xl md:text-2xl font-semibold text-midnight-green-500 dark:text-parchment-500 mb-6">
        Latest Logs
      </h2>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-sea-green-500 border-t-transparent mx-auto" />
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">{error}</div>
      ) : (
        <div className="space-y-6">
          {writings.length > 0 ? (
            writings.map((writing) => (
              <div
                key={writing.slug}
                className="flex justify-between items-center border-b border-tea-green-300 dark:border-midnight-green-300 pb-4"
              >
                <div>
                  <Link
                    href={`/writings/${writing.slug}`}
                    className="text-lg font-medium text-midnight-green-500 dark:text-parchment-500 hover:text-sea-green-500 dark:hover:text-sea-green-400"
                  >
                    {writing.title}
                  </Link>
                  <p className="text-sm text-midnight-green-400 dark:text-tea-green-400">
                    {writing.category}
                  </p>
                </div>
                <p className="text-sm text-midnight-green-300 dark:text-tea-green-300 font-jetbrains-mono">
                  {new Date(writing.createdAt).toDateString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-center text-midnight-green-400 dark:text-tea-green-400">
              No writings available.
            </p>
          )}
        </div>
      )}

      {writings.length > 0 && (
        <div className="mt-8 text-center">
          <Link
            href="/writings"
            className="inline-flex items-center gap-2 text-sea-green-500 dark:text-sea-green-400 hover:text-sea-green-600 dark:hover:text-sea-green-300"
          >
            View All Writings
            <span>→</span>
          </Link>
        </div>
      )}
    </section>
  );
}
