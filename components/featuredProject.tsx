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
    <section className="w-full py-20 border-b border-primary-200 dark:border-primary-700 bg-gradient-to-b from-transparent to-surface-light/50 dark:to-rich-500/10">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-4 text-primary-500 dark:text-accent-200">Featured Projects</h2>
        <p className="text-lg text-primary-600/80 dark:text-accent-200/90 text-center mb-12 max-w-2xl mx-auto">
          A few projects that survived my attention span.
        </p>

        {/* Show loading state */}
        {loading ? (
          <p className="text-center text-primary-400 animate-pulse">Fetching featured projects...</p>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.length > 0 ? (
                projects.map((project) => (
                  <Link key={project._id} href={`/projects/${project.slug}`}>
                    <div className="group relative bg-surface-light dark:bg-rich-500 rounded-xl p-6 hover:shadow-xl transition-all duration-300 border border-primary-200/50 dark:border-primary-700/50 hover:border-primary-300 dark:hover:border-primary-600">
                      {project.coverImage && (
                        <div className="relative w-full h-48 mb-6 rounded-lg overflow-hidden shadow-md">
                          <div className="absolute inset-0 bg-gradient-to-t from-rich-500/20 to-transparent z-10" />
                          <Image 
                            src={project.coverImage} 
                            alt={project.title} 
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="space-y-4">
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="text-xl font-bold text-primary-500 dark:text-accent-200 group-hover:text-accent-500 dark:group-hover:text-accent-300 transition-colors">
                            {project.title}
                          </h3>
                          <span className="px-3 py-1 text-xs font-medium bg-accent-100 text-accent-600 dark:bg-accent-500/10 dark:text-accent-300 rounded-full whitespace-nowrap">
                            {project.category}
                          </span>
                        </div>
                        <p className="text-primary-600/90 dark:text-accent-200/80 line-clamp-2 text-[15px] leading-relaxed">
                          {project.description}
                        </p>
                        
                        {project.tags && project.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">                            {project.tags.map((tag, index) => (
                              <span key={index} className="px-2.5 py-1 text-xs font-medium bg-rich-100 dark:bg-rich-600 text-gray-200 dark:white rounded-full border border-rich-500 dark:border-rich-500">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="pt-4 border-t border-primary-200/50 dark:border-primary-700/50 flex flex-wrap items-center gap-4">
                          {project.link && (
                            <a href={project.link} target="_blank" rel="noopener noreferrer" 
                               className="text-sm font-medium text-accent-500 hover:text-accent-600 dark:text-accent-300 dark:hover:text-accent-200 flex items-center gap-1.5 hover:gap-2.5 transition-all">
                              <span>View Case Study</span> →
                            </a>
                          )}
                          {project.github && (
                            <a href={project.github} target="_blank" rel="noopener noreferrer"
                               className="text-sm font-medium text-primary-500 hover:text-primary-600 dark:text-accent-200 dark:hover:text-accent-300 flex items-center gap-1.5 hover:gap-2.5 transition-all">
                              <span>GitHub</span> →
                            </a>
                          )}
                          {project.customLinks?.map((link, index) => (
                            <a key={index} href={link.url} target="_blank" rel="noopener noreferrer"
                               className="text-sm font-medium text-primary-900 hover:text-primary-600 dark:text-accent-200 dark:hover:text-accent-300 flex items-center gap-1.5 hover:gap-2.5 transition-all">
                              <span>{link.title}</span> →
                            </a>
                          ))}
                        </div>
                        <div className="pt-4 border-t border-primary-200/50 dark:border-primary-700/50 flex flex-wrap items-center gap-4">
                        <span className="px-3 py-1 text-xs font-medium bg-accent-100 text-accent-600 dark:bg-accent-500/10 dark:text-accent-300 rounded-full whitespace-nowrap">
                            {project.category}
                        </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-center col-span-3 text-primary-400 dark:text-accent-200/70">No featured projects found.</p>
              )}
            </div>

            {/* View All Projects Button */}
            <div className="text-center mt-16">
              <Link href="/projects" className="inline-flex items-center gap-2 px-8 py-3 text-base font-semibold bg-primary-500 hover:bg-primary-600 text-gray-200 dark:bg-primary-600 dark:hover:bg-primary-500 rounded-lg transition-all duration-300 hover:gap-3">
                View All Projects
                <span className="text-lg">→</span>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
