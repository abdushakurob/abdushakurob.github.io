"use client";
import { useEffect, useState } from "react";
import axios from "axios";

interface Writing {
  _id: string;
  title: string;
  content: string;
  category: string;
  tags?: string[];
  coverImage?: string;
  author: string;
  isDraft: boolean;
  createdAt: string;
  updatedAt: string;
  slug: string;
  excerpt?: string;
  readingTime?: number;
}

const itemsPerPage = 5;

export default function Writings() {
  const [writings, setWritings] = useState<Writing[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [filter, setFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWritings() {
      try {
        const res = await axios.get("/api/writings");
        const fetchedWritings: Writing[] = res.data;
        setWritings(fetchedWritings);

        // Extract unique categories dynamically
        const uniqueCategories = ["All", ...new Set(fetchedWritings.map((post) => post.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching writings:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchWritings();
  }, []);

  const stripHtml = (html: string | undefined) => html?.replace(/<[^>]*>/g, "") || "";

  const filteredWritings = filter === "All" ? writings : writings.filter((post) => post.category === filter);
  const totalPages = Math.ceil(filteredWritings.length / itemsPerPage);
  const paginatedWritings = filteredWritings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="min-h-screen bg-base-100 text-base-content px-6 sm:px-12 md:px-24 py-12 max-w-5xl mx-auto">
      {/* Page Header */}
      <h1 className="text-4xl font-bold text-green-600 mb-6">Writings</h1>
      <p className="text-lg text-gray-600">A mix of raw thoughts, things that worked, and lessons learned—no teaching, just experience.</p>

      {/* Filter Section */}
      <div className="overflow-x-auto whitespace-nowrap flex gap-2 mt-6 pb-2">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-4 py-2 rounded-lg transition ${
              filter === category ? "bg-green-600 text-white" : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => {
              setFilter(category);
              setCurrentPage(1);
            }}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Show Loading State */}
      {loading ? (
        <p className="text-center text-gray-500 mt-10">Loading writings...</p>
      ) : (
        <>
          {/* Writings List */}
          <div className="space-y-6 mt-10">
            {paginatedWritings.length > 0 ? (
              paginatedWritings.map((post) => (
                <div key={post.slug} className="border-b pb-4">
                  <h2 className="text-2xl font-semibold text-blue-500">{post.title}</h2>
                  <p className="text-gray-600">{post.category} — {new Date(post.createdAt).toDateString()}</p>
                  <p className="text-gray-600 mt-2">{stripHtml(post.excerpt)}</p>
                  <a href={`/writings/${post.slug}`} className="text-blue-500 mt-2 inline-block">Read More →</a>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 mt-10">No writings found in this category.</p>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-10">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={`px-4 py-2 mx-1 rounded-lg transition ${
                    currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
                  }`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
                  }
