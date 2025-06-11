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
    <section className="w-full py-16 border-b border-lapis-200/20 dark:border-lapis-700/20">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-6 text-lapis-DEFAULT dark:text-lapis-700">
          Featured Projects
        </h2>
        <p className="text-lg text-lapis-400 dark:text-tea-800 text-center mb-8">
          A few projects that survived my attention span.
        </p>

        {/* Show loading state */}
        {loading ? (
          <p className="text-center text-lapis-300">Fetching featured projects...</p>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.length > 0 ? (
                projects.map((project) => (
                  <Link key={project._id} href={`/projects/${project.slug}`}>
                    <div className="group bg-tea-900/50 dark:bg-lapis-200/50 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-lapis-200/10 dark:border-tea-800/10">
                      {project.coverImage && (
                        <div className="relative w-full h-40 mb-4 rounded-lg overflow-hidden">
                          <Image 
                            src={project.coverImage} 
                            alt={project.title} 
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        </div>
                      )}
                      <div>
                        <div className="flex items-start justify-between">
                          <h3 className="text-xl font-semibold text-lapis-DEFAULT dark:text-tea-800 group-hover:text-verdigris-DEFAULT dark:group-hover:text-verdigris-600 transition-colors">
                            {project.title}
                          </h3>
                          <span className="px-2.5 py-0.5 text-xs font-medium bg-emerald-DEFAULT/10 text-emerald-DEFAULT dark:bg-emerald-600/10 dark:text-emerald-600 rounded-full">
                            {project.category}
                          </span>
                        </div>
                        <p className="mt-2 text-lapis-400 dark:text-tea-800/80 line-clamp-2">
                          {project.description}
                        </p>
                        
                        {project.tags && project.tags.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {project.tags.map((tag, index) => (
                              <span key={index} className="px-2 py-1 text-xs bg-lapis-DEFAULT/5 dark:bg-tea-800/5 text-lapis-400 dark:text-tea-800 rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="mt-4 pt-4 border-t border-lapis-200/10 dark:border-tea-800/10 flex flex-wrap gap-3">
                          {project.link && (
                            <a href={project.link} target="_blank" rel="noopener noreferrer" 
                               className="text-sm text-verdigris-DEFAULT hover:text-verdigris-600 dark:text-verdigris-600 dark:hover:text-verdigris-500 flex items-center gap-1">
                              <span>View Case Study</span> →
                            </a>
                          )}
                          {project.github && (
                            <a href={project.github} target="_blank" rel="noopener noreferrer"
                               className="text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 flex items-center gap-1">
                              <span>GitHub</span> →
                            </a>
                          )}
                          {project.customLinks?.map((link, index) => (
                            <a key={index} href={link.url} target="_blank" rel="noopener noreferrer"
                               className="text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 flex items-center gap-1">
                              <span>{link.title}</span> →
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="col-span-3 text-center text-lapis-400 dark:text-tea-800">
                  No featured projects found.
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
