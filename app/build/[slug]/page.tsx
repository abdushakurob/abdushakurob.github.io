"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";

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
        const res = await axios.get(`/api/build/${slug}`);
        setTrack(res.data);
      } catch (error) {
        console.error("Error fetching track:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTrack();
  }, [slug]);

  if (loading) return <p className="text-center">Loading...</p>;
  if (!track) return <p className="text-center text-red-500">Track not found.</p>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold">{track.title}</h1>
      <p className="text-gray-600 mt-2">{track.description}</p>

      <h2 className="text-2xl font-semibold mt-10">Progress Updates</h2>
      <ul className="space-y-4 mt-4">
        {track.updates.map((update, index) => (
          <li key={index} className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-semibold">{update.title}</h3>
            <p className="text-sm text-gray-500">{new Date(update.date).toDateString()}</p>
            <p className="mt-2">{update.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
