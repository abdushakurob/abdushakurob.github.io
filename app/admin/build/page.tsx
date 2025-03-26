'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Pencil, Trash2, Plus, Eye } from 'lucide-react';
import axios from 'axios';

interface Track {
  _id: string;
  title: string;
  description: string;
  category: string;
  slug: string;
  createdAt: string;
  isCompleted: boolean;
  updates: { title: string; content: string; date: string }[];
}

export default function BuildPage() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTracks();
  }, []);

  const fetchTracks = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/build');
      setTracks(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch build tracks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteTrack = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this track?')) return;
    
    try {
      await axios.delete(`/api/build/${slug}`);
      setTracks(tracks.filter(track => track.slug !== slug));
    } catch (err) {
      setError('Failed to delete track');
      console.error(err);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Build Tracks</h1>
        <Link 
          href="/build/new" 
          className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus size={16} />
          <span>Add Track</span>
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading tracks...</div>
      ) : error ? (
        <div className="bg-red-100 text-red-600 p-4 rounded-md">{error}</div>
      ) : tracks.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-md">
          <p className="text-gray-500">No build tracks found</p>
          <Link 
            href="/build/new" 
            className="mt-4 inline-block text-blue-600 hover:underline"
          >
            Create your first track
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-md overflow-hidden border border-gray-200">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updates</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tracks.map((track) => (
                <tr key={track._id}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{track.title}</div>
                    <div className="text-sm text-gray-500">{track.slug}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                      {track.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {track.updates ? track.updates.length : 0} updates
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {track.isCompleted ? (
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Completed</span>
                    ) : (
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">In Progress</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <Link
                        href={`/build/${track.slug}`}
                        className="text-blue-600 hover:text-blue-900"
                        target="_blank"
                      >
                        <Eye size={18} />
                      </Link>
                      <Link
                        href={`/build/edit/${track.slug}`}
                        className="text-yellow-600 hover:text-yellow-900"
                      >
                        <Pencil size={18} />
                      </Link>
                      <button
                        onClick={() => deleteTrack(track.slug)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}