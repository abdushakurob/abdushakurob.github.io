"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

const itemsPerPage = 5;

export default function Writings() {
  const [writings, setWritings] = useState([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [filter, setFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch writings from API
  useEffect(() => {
    async function fetchWritings() {
      try {
        const res = await axios.get("/api/writings");
        const fetchedWritings = res.data;
        setWritings(fetchedWritings);

        // ✅ Extract unique categories dynamically
        const uniqueCategories = ["All", ...new Set(fetchedWritings.map((post: any) => post.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching writings:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchWritings();
  }, []);

  // ✅ Filter & Paginate Writings
  const filteredWritings = filter === "All" ? writings : writings.filter((post: any) => post.category === filter);
  const totalPages = Math.ceil(filteredWritings.length / itemsPerPage);
  const paginatedWritings = filteredWritings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="min-h-screen bg-base-100 text-base-content px-6 sm:px-12 md:px-24 py-12 max-w-5xl mx-auto">
      
      <h1 className="text-4xl font-bold text-green-600 mb-4">Writings</h1>
      <p className="text-lg text-gray-600 mb-6">
        A mix of raw thoughts, things that worked, and lessons learned—no teaching, just experience.
      </p>

      {/* Filters */}
      <div className="overflow-x-auto whitespace-nowrap flex gap-2 sm:gap-4 mt-4 pb-3 border-b">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-4 py-2 rounded-lg transition-all duration-200 ${
              filter === category ? "bg-blue-600 text-white shadow-md" : "bg-gray-200 hover:bg-gray-300"
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

      {/* Loading State */}
      {loading ? (
        <p className="text-center text-gray-500 mt-10">Loading writings...</p>
      ) : (
        <>
          {/* Writings List */}
          <div className="space-y-6 mt-10">
            {paginatedWritings.length > 0 ? (
              paginatedWritings.map((post: any) => (
                <div key={post.slug} className="border-b pb-6 flex flex-col md:flex-row gap-4">
                  {/* Cover Image */}
                  <div className="w-full md:w-48 h-32 overflow-hidden rounded-lg">
                    <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold text-blue-500">{post.title}</h2>
                    <p className="text-gray-600 text-sm">
                      {post.category} • {new Date(post.createdAt).toDateString()} • {post.readingTime} min read
                    </p>
                    <p className="text-gray-600 mt-2" dangerouslySetInnerHTML={{ __html: post.excerpt }} />
                    <Link href={`/writings/${post.slug}`} className="text-blue-600 font-medium mt-2 inline-block">
                      Read More →
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 mt-10">No writings found for this category.</p>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-10 gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                    currentPage === i + 1 ? "bg-blue-600 text-white shadow-md" : "bg-gray-200 hover:bg-gray-300"
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
