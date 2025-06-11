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
    <section className="w-full py-16 border-b border-tea-green-300 dark:border-midnight-green-400">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-6 text-midnight-green-500 dark:text-parchment-500">What&apos;s Cooking in My Brain</h2>
        <p className="text-lg text-midnight-green-400 dark:text-tea-green-400 mb-8">
          Stuff I&apos;m building, learning, and overthinking at the moment.
        </p>

        {loading ? (
          <p className="text-midnight-green-300 dark:text-tea-green-500 text-center">Fetching latest updates...</p>
        ) : tracks.length > 0 ? (
          <div className="space-y-6">
            {tracks.map((track) => (
              <div key={track._id} className="flex justify-between items-center border-b border-tea-green-300 dark:border-midnight-green-400 pb-4">
                <div>
                  <h3 className="text-xl font-medium text-midnight-green-500 dark:text-parchment-500 mb-1">
                    {track.title}
                  </h3>
                  <p className="text-midnight-green-400 dark:text-tea-green-400">
                    {track.category}
                  </p>
                </div>
                <Link
                  href={`/build/${track.title.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-sea-green-500 dark:text-sea-green-400 hover:underline"
                >
                  Read More →
                </Link>
              </div>
            ))}

            <div className="mt-8">
              <Link
                href="/build"
                className="inline-flex items-center text-sea-green-500 dark:text-sea-green-400 hover:underline"
              >
                View All Updates
                <svg
                  className="ml-1 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
              {lastUpdated && (
                <p className="text-sm text-midnight-green-300 dark:text-tea-green-500 mt-2">
                  Last updated: {lastUpdated}
                </p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-midnight-green-300 dark:text-tea-green-500 text-center">No updates yet</p>
        )}
      </div>
    </section>
  )
}
