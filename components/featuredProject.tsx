"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

interface Project {
  _id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
}

export default function FeaturedProject() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeaturedProjects() {
      try {
        const res = await axios.get("/api/projects?featured=true"); // ✅ Fetch featured projects only
        setProjects(res.data);
      } catch (error) {
        console.error("Error fetching featured projects:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchFeaturedProjects();
  }, []);

  return (
    <section className="w-full py-16 border-b border-gray-300 dark:border-gray-700">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-6">Featured Projects</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 text-center mb-8">
          A few projects that survived my attention span.
        </p>

        {/* Show loading state */}
        {loading ? (
          <p className="text-center text-gray-500">Fetching featured projects...</p>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.length > 0 ? (
                projects.map((project) => (
                  <Link key={project._id} href={`/projects/${project.slug}`}>
                    <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition cursor-pointer">
                      <h3 className="text-xl font-semibold text-blue-500">{project.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{project.category}</p>
                      <p className="mt-2 text-gray-700 dark:text-gray-300">{project.description}</p>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-center text-gray-500">No featured projects found.</p>
              )}
            </div>

            {/* View All Projects Button */}
            <div className="text-center mt-12">
              <Link href="/projects">
                <button className="px-6 py-3 text-lg font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  View All Projects →
                </button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
