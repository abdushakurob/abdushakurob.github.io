"use client"
import { useEffect, useState } from "react"
import axios from "axios"
import Link from "next/link"
import { ArrowRight, ChevronDown } from "lucide-react"

interface Track {
  _id: string
  title: string
  slug: string
  description: string
  category: string
  isCompleted: boolean
  createdAt: string
  milestones: { title: string; achieved: boolean; date?: string }[]
}

export default function Build() {
  const [tracks, setTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTrack, setActiveTrack] = useState<Track | null>(null)
  const [isOpen, setIsOpen] = useState(false) // Controls mobile dropdown

  useEffect(() => {
    async function fetchTracks() {
      try {
        const res = await axios.get("/api/build")
        const tracks = res.data.builds || []
        setTracks(tracks)
        if (tracks.length > 0) {
          setActiveTrack(tracks[0])
        }
      } catch (error) {
        console.error("Error fetching tracks:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchTracks()
  }, [])

  return (
    <div className="min-h-screen bg-base-100 text-base-content px-6 sm:px-12 md:px-24 py-12 max-w-5xl mx-auto">
      {/* ✅ Page Title */}
      <h1 className="text-4xl font-bold text-green-600 mb-6">Build in Public</h1>
      <p className="text-lg text-gray-600 mb-10">
        Tracking my progress on projects, challenges, and experiments. This is where I stay accountable.
      </p>

      {/* ✅ Loading State */}
      {loading ? (
        <p className="text-center text-gray-500 mt-10">Fetching projects...</p>
      ) : (
        <div className="flex flex-col md:flex-row gap-8">
          {/* ✅ Mobile Dropdown for Sidebar */}
          <div className="md:hidden mb-6">
            <button
              className="w-full flex items-center justify-between px-4 py-3 bg-blue-500 text-white rounded-lg shadow-md"
              onClick={() => setIsOpen(!isOpen)}
            >
              {activeTrack ? activeTrack.title : "Select a Project"}
              <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>
            {isOpen && (
              <div className="mt-2 bg-white shadow-md rounded-lg">
                {tracks.map((track) => (
                  <div
                    key={track._id}
                    onClick={() => {
                      setActiveTrack(track)
                      setIsOpen(false)
                    }}
                    className={`py-3 px-4 cursor-pointer transition-colors ${
                      activeTrack?._id === track._id
                        ? "bg-blue-500 text-white"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    {track.title}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ✅ Sidebar for Desktop */}
          <div className="hidden md:block md:w-1/3 bg-white rounded-xl shadow-lg p-4 border border-gray-200 overflow-y-auto max-h-[500px]">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">My Projects</h2>
            <div className="space-y-2">
              {tracks.map((track) => (
                <div
                  key={track._id}
                  onClick={() => setActiveTrack(track)}
                  className={`py-3 px-4 rounded-lg cursor-pointer transition-colors ${
                    activeTrack?._id === track._id
                      ? "bg-blue-500 text-white"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">{track.title}</h3>
                    {track.isCompleted && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Done</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{track.category}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ✅ Track Details Section */}
          {activeTrack ? (
            <div className="md:w-2/3">
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800">{activeTrack.title}</h2>
                  <span
                    className={`text-sm px-3 py-1 rounded-full ${
                      activeTrack.isCompleted ? "bg-green-500 text-white" : "bg-yellow-500 text-white"
                    }`}
                  >
                    {activeTrack.isCompleted ? "Completed" : "In Progress"}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {activeTrack.category} • Started on {new Date(activeTrack.createdAt).toDateString()}
                </p>
              </div>

              {/* ✅ Project Details */}
              <div className="bg-base-200 p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-medium mb-3 text-gray-700">About this project</h3>
                <p className="text-gray-600 leading-relaxed mb-4">{activeTrack.description}</p>
                
                {/* ✅ Milestones Preview */}
                {activeTrack.milestones && activeTrack.milestones.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-md font-medium mb-2 text-gray-700">Key Milestones</h4>
                    <div className="space-y-2">
                      {activeTrack.milestones.slice(0, 3).map((milestone, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${milestone.achieved ? 'bg-green-500' : 'bg-gray-300'}`} />
                          <span className="text-sm text-gray-600">{milestone.title}</span>
                        </div>
                      ))}
                      {activeTrack.milestones.length > 3 && (
                        <p className="text-sm text-blue-600 mt-2">
                          +{activeTrack.milestones.length - 3} more milestones
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* ✅ View Progress Button */}
              <div className="mt-6">
                <Link
                  href={`/build/${activeTrack.slug}`}
                  className="inline-flex items-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
                >
                  View detailed progress
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="md:w-2/3 flex items-center justify-center">
              <p className="text-gray-500 italic">Select a project to view details</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
