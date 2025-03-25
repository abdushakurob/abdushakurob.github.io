"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { CheckCircle2, Clock, Target, ArrowLeft } from "lucide-react";

interface Update {
  title: string;
  content: string;
  date: string;
}

interface Track {
  title: string;
  description: string;
  category: string;
  updates: Update[];
  milestones: { title: string; achieved: boolean; date?: string }[];
}

export default function TrackPage() {
  const { slug } = useParams();
  const [track, setTrack] = useState<Track | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrack() {
      try {
        const res = await axios.get(`/api/builds/${slug}`);
        setTrack(res.data);
      } catch (error) {
        console.error("Error fetching track:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTrack();
  }, [slug]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
      </div>
    );

  if (!track) return <p className="text-center text-red-500">Track not found.</p>;

  // Calculate progress metrics
  const completedMilestones = track.milestones.filter((m) => m.achieved).length;
  const totalMilestones = track.milestones.length;
  const progressPercentage = Math.round((completedMilestones / totalMilestones) * 100) || 0;

  // Sort updates by date (newest first)
  const sortedUpdates = [...track.updates].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back Button */}
      <Link href="/builds" className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to all builds
      </Link>

      {/* Track Title */}
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

      {/* Progress Overview */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold">Progress Overview</h2>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {completedMilestones} of {totalMilestones} milestones completed
        </p>
      </div>

      {/* Milestones */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold">Milestones</h2>
        <ul className="space-y-2 mt-2">
          {track.milestones.map((milestone, index) => (
            <li key={index} className="flex items-center gap-3">
              <div className={`${milestone.achieved ? "text-green-500" : "text-gray-300"}`}>
                {milestone.achieved ? <CheckCircle2 className="h-5 w-5" /> : <div className="h-5 w-5 rounded-full border-2 border-current" />}
              </div>
              <div>
                <p className={`text-sm font-medium ${milestone.achieved ? "text-green-700" : ""}`}>{milestone.title}</p>
                {milestone.achieved && milestone.date && (
                  <p className="text-xs text-gray-500">Completed on {new Date(milestone.date).toLocaleDateString()}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Live Update Feed */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold">Recent Updates</h2>
        <div className="space-y-4 mt-3">
          {sortedUpdates.length > 0 ? (
            sortedUpdates.map((update, index) => (
              <div key={index} className="relative pl-6 border-l-2 border-gray-200">
                <div className="absolute -left-3 top-2 h-4 w-4 rounded-full bg-blue-500" />
                <div>
                  <h3 className="font-semibold">{update.title}</h3>
                  <p className="text-xs text-gray-500">{new Date(update.date).toLocaleDateString()}</p>
                  <p className="text-sm mt-1 text-gray-600">{update.content}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No updates yet.</p>
          )}
        </div>
      </div>

      {/* View Full History */}
      <div className="text-center mt-8">
        <Link href={`/builds/${slug}/history`} className="text-blue-500 hover:underline">
          View Full History →
        </Link>
      </div>
    </div>
  );
}
