"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";

interface Project {
  _id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  coverImage?: string;
  tags?: string[];
  link?: string;
  github?: string;
  isFeatured: boolean;
  customLinks?: Array<{
    title: string;
    url: string;
    icon?: string;
  }>;
}

export default function FeaturedProject() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeaturedProjects() {
      try {
        const res = await axios.get("/api/projects?featured=true");
        const projectsData = res.data.projects || [];
        setProjects(projectsData.filter((p: Project) => p.isFeatured));
      } catch (error) {
        console.error("Error fetching featured projects:", error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    }
    fetchFeaturedProjects();
  }, []);

  return (
    <section className="mt-16">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-xl md:text-2xl font-semibold text-midnight-green-500 dark:text-parchment-500 mb-6">
          Featured Projects
        </h2>

        {/* Show loading state */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-sea-green-500 border-t-transparent mx-auto" />
          </div>
        ) : (
          <>
            {projects.length === 0 ? (
              <div className="text-center py-12 text-midnight-green-400 dark:text-tea-green-400">
                No featured projects yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((project) => (
                  <Link
                    key={project._id}
                    href={`/projects/${project.slug}`}
                    className="group block bg-parchment-500 dark:bg-midnight-green-400 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-tea-green-300 dark:border-midnight-green-300 overflow-hidden"
                  >
                    <div className="relative h-48">
                      {project.coverImage ? (
                        <Image
                          src={project.coverImage}
                          alt={project.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-200"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-parchment-600 dark:bg-midnight-green-300">
                          <div className="w-16 h-16 text-tea-green-400 dark:text-midnight-green-500">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                              />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-midnight-green-500 dark:text-parchment-500 group-hover:text-sea-green-500 dark:group-hover:text-sea-green-400 transition-colors">
                        {project.title}
                      </h3>
                      <p className="mt-2 text-midnight-green-400 dark:text-tea-green-400">
                        {project.description}
                      </p>

                      {project.tags && project.tags.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {project.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs bg-parchment-600 dark:bg-midnight-green-300 text-midnight-green-400 dark:text-tea-green-400 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}

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
