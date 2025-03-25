"use client"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import axios from "axios"
import Link from "next/link"
import { CheckCircle2, Clock, Target, ArrowLeft } from "lucide-react"

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
}

export default function TrackPage() {
  const { slug } = useParams()
  const [track, setTrack] = useState<Track | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTrack() {
      try {
        const res = await axios.get(`/api/build/${slug}`)
        setTrack(res.data)
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

  if (!track) return <p className="text-center text-red-500">Track not found.</p>

  // Calculate progress metrics
  const completedMilestones = track.milestones.filter((m) => m.achieved).length
  const totalMilestones = track.milestones.length
  const progressPercentage = Math.round((completedMilestones / totalMilestones) * 100) || 0

  // Sort updates by date (newest first)
  const sortedUpdates = [...track.updates].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/builds" className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to all builds
        </Link>
        <h1 className="text-3xl font-bold">{track.title}</h1>
        <p className="text-gray-600 mt-2">{track.description}</p>
        <div className="flex items-center mt-3">
          <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">{track.category}</span>
          {sortedUpdates.length > 0 && (
            <span className="text-xs text-gray-500 ml-3">
              Last updated: {new Date(sortedUpdates[0].date).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">Progress</h3>
            <Target className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold">{progressPercentage}%</div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {completedMilestones} of {totalMilestones} milestones completed
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">Updates</h3>
            <Clock className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold">{track.updates.length}</div>
          <p className="text-xs text-gray-500 mt-2">
            {track.updates.length > 0
              ? `Last update ${new Date(sortedUpdates[0].date).toLocaleDateString()}`
              : "No updates yet"}
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">Next Milestone</h3>
            <Target className="h-4 w-4 text-gray-400" />
          </div>
          {track.milestones.find((m) => !m.achieved) ? (
            <>
              <div className="text-lg font-medium truncate">{track.milestones.find((m) => !m.achieved)?.title}</div>
              <p className="text-xs text-gray-500 mt-2">In progress</p>
            </>
          ) : (
            <>
              <div className="text-lg font-medium">All complete!</div>
              <p className="text-xs text-gray-500 mt-2">Great job</p>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Milestones */}
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Milestones</h2>
          <ul className="space-y-3">
            {track.milestones.map((milestone, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className={`mt-0.5 ${milestone.achieved ? "text-green-500" : "text-gray-300"}`}>
                  {milestone.achieved ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-current" />
                  )}
                </div>
                <div>
                  <p className={`text-sm font-medium ${milestone.achieved ? "text-green-700" : ""}`}>
                    {milestone.title}
                  </p>
                  {milestone.achieved && milestone.date && (
                    <p className="text-xs text-gray-500">
                      Completed on {new Date(milestone.date).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Progress Updates */}
        <div className="md:col-span-2 bg-white p-5 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Progress Updates</h2>
          <div className="space-y-6">
            {sortedUpdates.length > 0 ? (
              sortedUpdates.map((update, index) => (
                <div
                  key={index}
                  className="relative pl-6 before:absolute before:left-0 before:top-0 before:h-full before:w-px before:bg-gray-200"
                >
                  <div className="absolute -left-1.5 top-1 h-3 w-3 rounded-full bg-blue-500" />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{update.title}</h3>
                      <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">
                        {new Date(update.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{update.content}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="rounded-full bg-gray-100 p-3">
                  <Clock className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">No updates yet</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Add your first progress update to start tracking your journey
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

