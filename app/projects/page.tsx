'use client'
  import { useState } from "react";

const projectsData = [
  { id: 1, title: "Freshbite Identity", category: "Branding", description: "Helping Freshbite establish a bold and modern visual identity.", link: "#" },
  { id: 2, title: "SwiftPay", category: "Web Dev", description: "A decentralized payment system built with Web3 principles.", link: "#" },
  { id: 3, title: "Campus Navigator", category: "Web3", description: "A GPS-based PWA that works even without internet access.", link: "#" },
  { id: 4, title: "SaaS Landing Generator", category: "Web Dev", description: "An AI-powered SaaS landing page generator.", link: "#" },
  { id: 5, title: "Portfolio Site", category: "Web Dev", description: "My personal portfolio, built to document my journey.", link: "#" },
];

const itemsPerPage = 3;

export default function Projects() {
  const [filter, setFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProjects = filter === "All" ? projectsData : projectsData.filter((p) => p.category === filter);
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const paginatedProjects = filteredProjects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="min-h-screen bg-base-100 text-base-content px-6 sm:px-12 md:px-24 py-12 max-w-5xl mx-auto">
      
      <h1 className="text-4xl font-bold text-green-600 mb-6">Projects</h1>
      <p className="text-lg text-gray-600">
        A collection of things I’ve built, designed, or experimented with. Some projects are complete, some are in progress, 
        and others are just ideas I’ve started exploring.
      </p>

      {/* Filters (Scrollable on Mobile) */}
<div className="overflow-x-auto whitespace-nowrap flex gap-4 mt-6 pb-2">
  {["All", "Branding", "Web Dev", "Web3"].map((category) => (
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

      {/* Projects List */}
      <div className="grid md:grid-cols-2 gap-8 mt-10">
        {paginatedProjects.map((project) => (
          <div key={project.id} className="card bg-base-200 shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-blue-500">{project.title}</h2>
            <p className="text-gray-600">{project.category}</p>
            <p className="text-gray-600 mt-2">{project.description}</p>
            <a href={project.link} className="text-blue-500 mt-4 block">View Project →</a>
          </div>
        ))}
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
    </div>
  );
    }
