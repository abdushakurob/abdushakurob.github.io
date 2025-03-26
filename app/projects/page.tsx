"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";

interface Project {
  _id: string;
  title: string;
  slug: string;
  description: string;
  coverImage?: string;
  tags?: string[];
  category: string;
  link?: string;
  github?: string;
  isFeatured: boolean;
  createdAt: string;
  manualDate?: string;
  customLinks?: Array<{
    title: string;
    url: string;
    icon?: string;
  }>;
}

const itemsPerPage = 3;

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await axios.get("/api/projects");
        const fetchedProjects: Project[] = res.data;

        setProjects(fetchedProjects);

        // Generate unique categories and tags
        const uniqueCategories = ["All", ...new Set(fetchedProjects.map((p) => p.category))];
        setCategories(uniqueCategories);

        // Get all unique tags
        const tags = new Set<string>();
        fetchedProjects.forEach(project => {
          project.tags?.forEach(tag => tags.add(tag));
        });
        setAllTags(Array.from(tags));
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  // Filter & Paginate Projects
  const filteredProjects = projects.filter(project => {
    const matchesCategory = filter === "All" || project.category === filter;
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.every(tag => project.tags?.includes(tag));
    
    return matchesCategory && matchesSearch && matchesTags;
  });

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const paginatedProjects = filteredProjects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-base-100 text-base-content px-6 sm:px-12 md:px-24 py-12 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold text-green-600 mb-6">Projects</h1>
      <p className="text-lg text-gray-600">
        A collection of things I&apos;ve built, designed, or experimented with. Some are finished, some are ongoing, and some are just ideas I started exploring.
      </p>

      {/* Search Bar */}
      <div className="mt-6">
        <input
          type="text"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Filters */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Categories</h3>
        <div className="overflow-x-auto whitespace-nowrap flex gap-4 pb-2">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-lg transition ${
                filter === category ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
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
      </div>

      {/* Tags */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              className={`px-3 py-1 rounded-full text-sm transition ${
                selectedTags.includes(tag)
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Show Loading State */}
      {loading ? (
        <p className="text-center text-gray-500 mt-10">Fetching projects...</p>
      ) : (
        <>
          {/* Projects List */}
          <div className="grid md:grid-cols-2 gap-8 mt-10">
            {paginatedProjects.length > 0 ? (
              paginatedProjects.map((project) => (
                <Link key={project._id} href={`/projects/${project.slug}`}>
                  <div className="card bg-base-200 shadow-lg p-6 rounded-lg hover:shadow-xl transition cursor-pointer h-full">
                    {project.coverImage && (
                      <div className="relative w-full h-48 mb-4">
                        <Image 
                          src={project.coverImage} 
                          alt={project.title} 
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                    )}
                    <div className="flex flex-col h-full">
                      <h2 className="text-2xl font-semibold text-blue-500">{project.title}</h2>
                      <p className="text-gray-600">{project.category}</p>
                      <p className="text-gray-600 mt-2 flex-grow">{project.description}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {project.tags?.map((tag, index) => (
                          <span key={index} className="px-2 py-1 text-sm bg-gray-100 rounded-full text-gray-600">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {project.link && (
                          <a href={project.link} target="_blank" rel="noopener noreferrer" 
                             className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                            Live Demo →
                          </a>
                        )}
                        {project.github && (
                          <a href={project.github} target="_blank" rel="noopener noreferrer"
                             className="px-3 py-1 text-sm bg-gray-700 text-white rounded-lg hover:bg-gray-800">
                            GitHub →
                          </a>
                        )}
                        {project.customLinks?.map((link, index) => (
                          <a key={index} href={link.url} target="_blank" rel="noopener noreferrer"
                             className="px-3 py-1 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                            {link.title} →
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-center text-gray-500 col-span-2">No projects found matching your criteria.</p>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`px-4 py-2 rounded-lg transition ${
                    currentPage === page ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
                  }`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
