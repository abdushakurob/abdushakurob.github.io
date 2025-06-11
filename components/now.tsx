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
    <section className="w-full py-16 border-b border-primary-200 dark:border-primary-700">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-6 text-primary-600 dark:text-accent-300">What&apos;s Cooking in My Brain</h2>
        <p className="text-lg text-primary-600/80 dark:text-accent-200/90 mb-8">
          Stuff I&apos;m building, learning, and overthinking at the moment.
        </p>

        {loading ? (
          <p className="text-primary-400 text-center">Fetching latest updates...</p>
        ) : tracks.length > 0 ? (
          <div className="space-y-6">
            {tracks.map((track) => (
              <div key={track._id} className="flex justify-between items-center border-b border-primary-200 dark:border-primary-700 pb-4">
                <p className="text-primary-600 dark:text-accent-200">{track.title}</p>
                <span className="text-xs text-accent-500 dark:text-accent-300 font-jetbrains-mono">
                  [{track.category}]
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-primary-400 dark:text-accent-200/70">No active builds right now.</p>
        )}

        <Link href="/build" 
              className="inline-block mt-6 text-accent-500 hover:text-accent-600 dark:text-accent-300 dark:hover:text-accent-200 font-medium transition-colors">
          View More →
        </Link>

        <p className="mt-8 text-sm text-primary-400 dark:text-accent-200/70 font-jetbrains-mono">
          Last updated:{" "}
          <span className="text-accent-500 dark:text-accent-300">
            {lastUpdated || "just now"}
          </span>{" "}
          <i className="text-primary-400/80 dark:text-accent-200/60">(or maybe forever ago)</i>
        </p>
      </div>
    </section>
  )
}
