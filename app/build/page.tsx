"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

interface Track {
  _id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  isCompleted: boolean;
  createdAt: string;
}

export default function Build() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTracks() {
      try {
        const res = await axios.get("/api/build");
        setTracks(res.data);
      } catch (error) {
        console.error("Error fetching tracks:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTracks();
  }, []);

  return (
    <div className="min-h-screen bg-base-100 text-base-content px-6 sm:px-12 md:px-24 py-12 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold text-green-600 mb-6">Build In Public</h1>
      <p className="text-lg text-gray-600">
        Tracking my progress on projects, challenges, and experiments. This is where I stay accountable.
      </p>

      {loading ? (
        <p className="text-center text-gray-500 mt-10">Fetching projects...</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-8 mt-10">
          {tracks.map((track) => (
            <div key={track._id} className="card bg-base-200 shadow-lg p-6 rounded-lg">
              <h2 className="text-2xl font-semibold text-blue-500">{track.title}</h2>
              <p className="text-gray-600">{track.category}</p>
              <p className="text-gray-600 mt-2">{track.description}</p>
              <Link href={`/build/${track.slug}`} className="text-blue-500 mt-4 block">
                View Progress →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
