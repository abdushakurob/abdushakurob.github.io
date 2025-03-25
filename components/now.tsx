"use client"
import { useEffect, useState } from "react"
import axios from "axios"
import Link from "next/link"

interface Track {
  _id: string
  title: string
  category: string
  createdAt: string
}

export default function Now() {
  const [tracks, setTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTracks() {
      try {
        const res = await axios.get("/api/build")
        const latestTracks = res.data.slice(0, 3) // ✅ Show only latest 3
        setTracks(latestTracks)

        // ✅ Get latest update time
        if (latestTracks.length > 0) {
          setLastUpdated(new Date(latestTracks[0].createdAt).toLocaleDateString())
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
    <section className="w-full py-16 border-b border-gray-300 dark:border-gray-700">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-6">What&apos;s Cooking in My Brain</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Stuff I&apos;m building, learning, and overthinking at the moment.
        </p>

        {loading ? (
          <p className="text-gray-500 text-center">Fetching latest updates...</p>
        ) : tracks.length > 0 ? (
          <div className="space-y-6">
            {tracks.map((track) => (
              <div key={track._id} className="flex justify-between items-center border-b pb-4">
                <p className="text-gray-900 dark:text-gray-100">{track.title}</p>
                <span className="text-xs text-blue-500 font-jetbrains-mono">
                  [{track.category}]
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No active builds right now.</p>
        )}

        <Link href="/build" className="inline-block mt-6 text-blue-600 dark:text-blue-400 font-medium">
          View More →
        </Link>

        <p className="mt-8 text-sm text-gray-500 dark:text-gray-400 font-jetbrains-mono">
          Last updated:{" "}
          <span className="text-green-500">
            {lastUpdated || "just now"}
          </span>{" "}
          <i>(or maybe forever ago)</i>
        </p>
      </div>
    </section>
  )
}
