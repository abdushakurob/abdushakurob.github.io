"use client";
import { useEffect, useState } from "react";
import axios from "axios";

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
}

const itemsPerPage = 3;

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>(["All"]);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await axios.get("/api/projects");
        const fetchedProjects: Project[] = res.data;

        setProjects(fetchedProjects);

        // ✅ Generate dynamic categories from fetched projects
        const uniqueCategories = ["All", ...new Set(fetchedProjects.map((p) => p.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  // ✅ Filter & Paginate Projects
  const filteredProjects = filter === "All" ? projects : projects.filter((p) => p.category === filter);
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const paginatedProjects = filteredProjects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="min-h-screen bg-base-100 text-base-content px-6 sm:px-12 md:px-24 py-12 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold text-green-600 mb-6">Projects</h1>
      <p className="text-lg text-gray-600">
        A collection of things I’ve built, designed, or experimented with. Some are finished, some are ongoing, and some are just ideas I started exploring.
      </p>

      {/* Filters (Now Dynamic) */}
      <div className="overflow-x-auto whitespace-nowrap flex gap-4 mt-6 pb-2">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-4 py-2 rounded-lg ${
              filter === category ? "bg-blue-500 text-white" : "bg-gray-200"
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
        <p className="text-center text-gray-500 mt-10">Fetching projects...</p>
      ) : (
        <>
          {/* Projects List */}
          <div className="grid md:grid-cols-2 gap-8 mt-10">
            {paginatedProjects.length > 0 ? (
              paginatedProjects.map((project) => (
                <div key={project._id} className="card bg-base-200 shadow-lg p-6 rounded-lg">
                  {project.coverImage && (
                    <img src={project.coverImage} alt={project.title} className="w-full h-40 object-cover rounded-lg mb-4" />
                  )}
                  <h2 className="text-2xl font-semibold text-blue-500">{project.title}</h2>
                  <p className="text-gray-600">{project.category}</p>
                  <p className="text-gray-600 mt-2">{project.description}</p>

                  {/* ✅ Show links only if available */}
                  <div className="flex gap-4 mt-4">
                    {project.link && (
                      <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                        Live Project →
                      </a>
                    )}
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-gray-500">
                        GitHub Repo →
                      </a>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No projects found.</p>
            )}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-10">
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} className={`px-4 py-2 mx-1 rounded-lg ${currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"}`} 
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
