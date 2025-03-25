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
    <div className="min-h-screen bg-base-100 text-base-content px-6 sm:px-12 md:px-24 py-12 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold text-green-600 mb-6">Build in Public</h1>
      <p className="text-lg text-gray-600 mb-10">
        Tracking my progress on projects, challenges, and experiments. This is where I stay accountable.
      </p>

      {loading ? (
        <p className="text-center text-gray-500 mt-10">Fetching projects...</p>
      ) : (
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar - List of Tracks */}
          <div className="md:w-1/3">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">My Projects</h2>
            <div className="space-y-1">
              {tracks.map((track) => (
                <div
                  key={track._id}
                  onClick={() => setActiveTrack(track)}
                  className={`py-3 px-4 rounded-md cursor-pointer transition-colors ${
                    activeTrack?._id === track._id
                      ? "bg-blue-100 border-l-4 border-blue-500"
                      : "hover:bg-gray-100 border-l-4 border-transparent"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <h3 className={`font-medium ${activeTrack?._id === track._id ? "text-blue-600" : "text-gray-700"}`}>
                      {track.title}
                    </h3>
                    {track.isCompleted && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Done</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{track.category}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Track Details Section */}
          {activeTrack ? (
            <div className="md:w-2/3">
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800">{activeTrack.title}</h2>
                  <span
                    className={`text-sm px-3 py-1 rounded-full ${
                      activeTrack.isCompleted ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {activeTrack.isCompleted ? "Completed" : "In Progress"}
                  </span>
                </div>
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <span className="mr-3">{activeTrack.category}</span>
                  <span>Started {new Date(activeTrack.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6 shadow-sm">
                <h3 className="text-lg font-medium mb-3 text-gray-700">About this project</h3>
                <p className="text-gray-600 leading-relaxed">{activeTrack.description}</p>
              </div>

              <Link
                href={`/build/${activeTrack.slug}`}
                className="inline-flex items-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              >
                View detailed progress
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
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
