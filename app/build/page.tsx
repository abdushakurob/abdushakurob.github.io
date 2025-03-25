"use client"
import { useEffect, useState } from "react"
import axios from "axios"
import Link from "next/link"
import { CheckCircle2, Clock, Filter, Layers, Target } from "lucide-react"

interface Track {
  _id: string
  title: string
  slug: string
  description: string
  category: string
  isCompleted: boolean
  createdAt: string
}

export default function Build() {
  const [tracks, setTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>("all")
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    async function fetchTracks() {
      try {
        const res = await axios.get("/api/build")
        setTracks(res.data)

        // Extract unique categories
        const uniqueCategories = [...new Set(res.data.map((track: Track) => track.category))] as string[]
        setCategories(uniqueCategories)
      } catch (error) {
        console.error("Error fetching tracks:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchTracks()
  }, [])

  // Filter tracks based on selected category
  const filteredTracks = filter === "all" ? tracks : tracks.filter((track) => track.category === filter)

  return (
    <div className="min-h-screen bg-base-100 text-base-content px-6 sm:px-12 md:px-24 py-12 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-green-600 mb-6">Build In Public</h1>
        <p className="text-lg text-gray-600">
          Tracking my progress on projects, challenges, and experiments. This is where I stay accountable.
        </p>
      </div>

      {/* Filter by category */}
      {!loading && categories.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <div className="flex items-center text-gray-500 mr-2">
            <Filter className="h-4 w-4 mr-1" />
            <span className="text-sm">Filter:</span>
          </div>
          <button
            onClick={() => setFilter("all")}
            className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
              filter === "all" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All Projects
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                filter === category ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-gray-500 mt-4">Fetching projects...</p>
        </div>
      ) : filteredTracks.length === 0 ? (
        <div className="text-center py-16">
          <Layers className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700">No projects found</h3>
          <p className="text-gray-500 mt-2">
            {filter !== "all" ? `No projects in the "${filter}" category` : "Start by adding your first project"}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {filteredTracks.map((track) => (
            <div
              key={track._id}
              className="bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-xl font-semibold text-blue-600">{track.title}</h2>
                  {track.isCompleted ? (
                    <span className="flex items-center text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Completed
                    </span>
                  ) : (
                    <span className="flex items-center text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                      <Clock className="h-3 w-3 mr-1" />
                      In Progress
                    </span>
                  )}
                </div>
                <div className="flex items-center mb-3">
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">{track.category}</span>
                  <span className="text-xs text-gray-500 ml-3">
                    Started {new Date(track.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4">{track.description}</p>
                <Link
                  href={`/build/${track.slug}`}
                  className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <Target className="h-4 w-4 mr-1" />
                  View Progress
                  <span className="ml-1">→</span>
                </Link>
              </div>
              {/* Visual progress indicator at bottom of card */}
              <div className={`h-1 w-full ${track.isCompleted ? "bg-green-500" : "bg-blue-500"}`}></div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

