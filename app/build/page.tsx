"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
  const [activeTrack, setActiveTrack] = useState<Track | null>(null);

  useEffect(() => {
    async function fetchTracks() {
      try {
        const res = await axios.get("/api/build");
        setTracks(res.data);
        if (res.data.length > 0) {
          setActiveTrack(res.data[0]);
        }
      } catch (error) {
        console.error("Error fetching tracks:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTracks();
  }, []);

  return (
    <div className="min-h-screen bg-base-100 text-base-content px-6 sm:px-12 md:px-24 py-12 max-w-6xl mx-auto">
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
          {/* ✅ Sidebar - List of Tracks */}
          <div className="md:w-1/3 bg-white rounded-xl shadow-lg p-4 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">My Projects</h2>
            <div className="space-y-2">
              {tracks.map((track) => (
                <div
                  key={track._id}
                  onClick={() => setActiveTrack(track)}
                  className={`cursor-pointer p-4 rounded-lg transition-all border ${
                    activeTrack?._id === track._id
                      ? "bg-blue-50 border-blue-500 shadow-md"
                      : "hover:bg-gray-100 border-gray-200"
                  }`}
                >
                  <h3
                    className={`font-medium text-gray-800 ${
                      activeTrack?._id === track._id ? "text-blue-600" : ""
                    }`}
                  >
                    {track.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">{track.category}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ✅ Track Details Section */}
          {activeTrack ? (
            <div className="md:w-2/3 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
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
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-300">
                <h3 className="text-lg font-medium mb-3 text-gray-700">About this project</h3>
                <p className="text-gray-600 leading-relaxed">{activeTrack.description}</p>
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
  );
}
