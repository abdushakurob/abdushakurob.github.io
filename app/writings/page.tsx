'use client'
import { useState } from "react";

const logsData = [
  { id: 1, title: "My logo lost its life after vectorizing it", topic: "Branding", date: "March 22, 2025", description: "Why some logos lose their essence when taken from sketch to vector.", link: "#" },
  { id: 2, title: "What’s more important when designing logos?", topic: "Design", date: "March 19, 2025", description: "Breaking down what truly matters in a logo.", link: "#" },
  { id: 3, title: "Why most designers struggle with their own logo", topic: "Thoughts", date: "March 17, 2025", description: "Designers create for others easily, but when it’s personal, it gets complicated.", link: "#" },
];

const itemsPerPage = 2;

export default function Writings() {
  const [filter, setFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredLogs = filter === "All" ? logsData : logsData.filter((log) => log.topic === filter);
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="min-h-screen bg-base-100 text-base-content px-6 sm:px-12 md:px-24 py-12 max-w-5xl mx-auto">
      
      <h1 className="text-4xl font-bold text-green-600 mb-6">Writings</h1>
      <p className="text-lg text-gray-600">A mix of raw thoughts, things that worked, and lessons learned—no teaching, just experience.</p>

      {/* Filters */}
      <div className="flex gap-4 mt-6">
        {["All", "Branding", "Design", "Thoughts"].map((topic) => (
          <button
            key={topic}
            className={`px-4 py-2 rounded-lg ${filter === topic ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            onClick={() => { setFilter(topic); setCurrentPage(1); }}
          >
            {topic}
          </button>
        ))}
      </div>

      {/* Logs List */}
      <div className="space-y-6 mt-10">
        {paginatedLogs.map((log) => (
          <div key={log.id} className="border-b pb-4">
            <h2 className="text-2xl font-semibold text-blue-500">{log.title}</h2>
            <p className="text-gray-600">{log.topic} — {log.date}</p>
            <p className="text-gray-600 mt-2">{log.description}</p>
            <a href={log.link} className="text-blue-500 mt-2 block">Read More →</a>
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
