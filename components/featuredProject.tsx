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
    <section className="w-full py-16 border-b border-gray-300 dark:border-gray-700">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Featured Projects
        </h2>
        <p className="text-md md:text-lg text-gray-600 dark:text-gray-300 text-center mb-10">
          A few things that survived my attention span.
        </p>

        {loading ? (
          <p className="text-center text-gray-500">Loading featured projects...</p>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.length > 0 ? (
                projects.map((project) => (
                  <Link key={project._id} href={`/projects/${project.slug}`}>
                    <div className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
                      {project.coverImage && (
                        <div className="relative w-full h-40 mb-4 rounded-xl overflow-hidden">
                          <Image
                            src={project.coverImage}
                            alt={project.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        </div>
                      )}

                      <div>
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-500 transition">
                            {project.title}
                          </h3>
                          <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-full font-jetbrains-mono">
                            {project.category}
                          </span>
                        </div>

                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                          {project.description}
                        </p>

                        {project.tags && project.tags.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {project.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="text-xs font-jetbrains-mono px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-wrap gap-4 text-sm">
                          {project.link && (
                            <a
                              href={project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
                            >
                              <span>Case Study</span> →
                            </a>
                          )}
                          {project.github && (
                            <a
                              href={project.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center gap-1"
                            >
                              <span>GitHub</span> →
                            </a>
                          )}
                          {project.customLinks?.map((link, index) => (
                            <a
                              key={index}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center gap-1"
                            >
                              <span>{link.title}</span> →
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-center text-gray-500">No featured projects yet.</p>
              )}
            </div>

            <div className="text-center mt-12">
              <Link href="/projects">
                <button className="px-6 py-3 text-md md:text-lg font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-500 transition">
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
