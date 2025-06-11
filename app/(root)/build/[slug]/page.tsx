"use client"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import axios from "axios"
import Link from "next/link"
import { CheckCircle2, Clock, Target, ArrowLeft } from "lucide-react"
import { processQuillHtml } from "@/lib/quill-html-processor"

interface Update {
  title: string
  content: string
  date: string
}

interface Track {
  title: string
  description: string
  category: string
  updates: Update[]
  milestones: { title: string; achieved: boolean; date?: string }[]
  links: string[]
  isCompleted: boolean
  createdAt: string
}

export default function TrackPage() {
  const { slug } = useParams()
  const [track, setTrack] = useState<Track | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTrack() {
      try {
        const res = await axios.get(`/api/build/${slug}`)
        setTrack(res.data.build) // Access the build property from response data
      } catch (error) {
        console.error("Error fetching track:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchTrack()
  }, [slug])

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
      </div>
    )

  if (!track)
    return (
      <div className="text-center py-10">
        <p className="text-lg text-red-500">Track not found.</p>
        <Link href="/build" className="text-blue-500 hover:underline">← Back to Builds</Link>
      </div>
    )

  // ✅ Calculate progress
  const completedMilestones = track.milestones.filter((m) => m.achieved).length
  const totalMilestones = track.milestones.length
  const progressPercentage = totalMilestones ? Math.round((completedMilestones / totalMilestones) * 100) : 0

  // ✅ Sort updates (newest first)
  const sortedUpdates = [...track.updates].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="min-h-screen bg-base-100 text-base-content px-6 sm:px-12 md:px-24 py-12 max-w-5xl mx-auto">
      {/* ✅ Header */}
      <div className="flex items-center mb-6">
        <Link href="/build" className="flex items-center text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-5 w-5 mr-2" />
          <span className="text-lg">Back to Builds</span>
        </Link>
      </div>

      {/* ✅ Track Details */}
      <h1 className="text-4xl font-bold text-green-600">{track.title}</h1>
      <p className="text-lg text-gray-600 mt-2">{track.description}</p>
      <p className="text-sm text-gray-500 mt-2">
        {track.category} • Started on {new Date(track.createdAt).toDateString()}
      </p>

      {/* ✅ Related Links */}
      {track.links.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-medium">Related Links</h3>
          <ul className="list-disc list-inside text-blue-500">
            {track.links.map((link, index) => (
              <li key={index}>
                <a href={link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ✅ Progress Overview */}
      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <div className="bg-base-200 p-4 rounded-xl shadow-md">
          <h3 className="text-sm font-medium text-gray-600">Progress</h3>
          <div className="text-2xl font-bold mt-1">{progressPercentage}%</div>
          <div className="w-full bg-gray-300 rounded-full h-2 mt-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
          </div>
          <p className="text-xs text-gray-500 mt-2">{completedMilestones} of {totalMilestones} milestones completed</p>
        </div>

        <div className="bg-base-200 p-4 rounded-xl shadow-md">
          <h3 className="text-sm font-medium text-gray-600">Updates</h3>
          <div className="text-2xl font-bold mt-1">{track.updates.length}</div>
          <p className="text-xs text-gray-500 mt-2">
            {track.updates.length > 0 ? `Last update: ${new Date(sortedUpdates[0].date).toDateString()}` : "No updates yet"}
          </p>
        </div>

        <div className="bg-base-200 p-4 rounded-xl shadow-md">
          <h3 className="text-sm font-medium text-gray-600">Next Milestone</h3>
          <p className="text-lg font-semibold mt-1">
            {track.milestones.find((m) => !m.achieved)?.title || "All complete!"}
          </p>
        </div>
      </div>

      {/* ✅ Milestones */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold text-blue-500">Milestones</h2>
        <div className="space-y-4 mt-4">
          {track.milestones.map((milestone, index) => (
            <div key={index} className="bg-base-200 p-4 rounded-xl flex items-center">
              <div className={`h-6 w-6 rounded-full flex items-center justify-center ${
                milestone.achieved ? "bg-green-500 text-white" : "bg-gray-300"
              }`}>
                {milestone.achieved ? <CheckCircle2 className="h-4 w-4" /> : <div className="h-4 w-4" />}
              </div>
              <div className="ml-3">
                <p className="text-gray-700">{milestone.title}</p>
                {milestone.achieved && milestone.date && (
                  <p className="text-sm text-gray-500">Completed on {new Date(milestone.date).toDateString()}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Updates */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold text-blue-500">Progress Updates</h2>
        <div className="space-y-6 mt-4">
          {sortedUpdates.length > 0 ? (
            sortedUpdates.map((update, index) => (
              <div key={index} className="bg-base-200 p-4 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-800">{update.title}</h3>
                <p className="text-sm text-gray-500">{new Date(update.date).toDateString()}</p>
                <div className="mt-2 prose max-w-none" 
                  dangerouslySetInnerHTML={{ __html: processQuillHtml(update.content) }} />
              </div>
            ))
          ) : (
            <p className="text-gray-500">No updates yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
