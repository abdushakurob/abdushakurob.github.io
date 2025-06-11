'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Pencil, Trash2, Plus, Eye } from 'lucide-react';
import axios from 'axios';

interface Track {
  _id: string;
  title: string;
  slug: string;
  category: string;
  status: 'draft' | 'published' | 'archived';
  isCompleted: boolean;
  updates?: { _id: string; title: string; content: string; date: string }[];
}

export default function BuildPage() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    fetchTracks();
  }, []);

  const fetchTracks = async () => {
    try {
      const response = await axios.get('/api/build');
      setTracks(response.data);
    } catch (err) {
      setError('Failed to fetch tracks');
      console.error('Error fetching tracks:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateTrackStatus = async (slug: string, status: 'draft' | 'published' | 'archived') => {
    try {
      await axios.patch(`/api/build/${slug}`, { status });
      fetchTracks();
    } catch (err) {
      console.error('Error updating track status:', err);
    }
  };

  const deleteTrack = async (slug: string) => {
    if (!window.confirm('Are you sure you want to delete this track?')) return;

    try {
      await axios.delete(`/api/build/${slug}`);
      fetchTracks();
    } catch (err) {
      console.error('Error deleting track:', err);
    }
  };

  const filteredTracks = tracks.filter(track => {
    if (statusFilter !== 'all' && track.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && track.category !== categoryFilter) return false;
    return true;
  });

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-midnight-green-500 dark:text-parchment-500">Build Tracks</h1>
        <Link 
          href="/admin/build/new" 
          className="inline-flex items-center px-4 py-2 bg-sea-green-500 dark:bg-sea-green-400 text-parchment-500 dark:text-midnight-green-500 rounded-md hover:bg-sea-green-600 dark:hover:bg-sea-green-300 transition-colors"
        >
          <Plus size={16} className="mr-2" />
          New Track
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-midnight-green-400 dark:text-tea-green-400">Loading...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      ) : tracks.length === 0 ? (
        <div className="text-center py-8 bg-tea-green-300 dark:bg-midnight-green-400 rounded-md">
          <p className="text-midnight-green-400 dark:text-tea-green-400">No build tracks found</p>
          <Link 
            href="/admin/build/new" 
            className="mt-4 inline-block text-sea-green-500 dark:text-sea-green-400 hover:text-sea-green-600 dark:hover:text-sea-green-300"
          >
            Create your first track
          </Link>
        </div>
      ) : (
        <div className="bg-tea-green-300 dark:bg-midnight-green-400 rounded-md overflow-hidden border border-celadon-300 dark:border-midnight-green-300">
          <table className="w-full">
            <thead className="bg-tea-green-300/50 dark:bg-midnight-green-300/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-midnight-green-400 dark:text-tea-green-400 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-midnight-green-400 dark:text-tea-green-400 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-midnight-green-400 dark:text-tea-green-400 uppercase tracking-wider">Updates</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-midnight-green-400 dark:text-tea-green-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-midnight-green-400 dark:text-tea-green-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-celadon-300 dark:divide-midnight-green-300">
              {filteredTracks.map((track) => (
                <tr key={track._id} className="hover:bg-celadon-300 dark:hover:bg-midnight-green-300 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-midnight-green-500 dark:text-parchment-500">{track.title}</div>
                    <div className="text-sm text-midnight-green-400 dark:text-tea-green-400">{track.slug}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-sea-green-500/10 text-sea-green-500 dark:bg-sea-green-400/10 dark:text-sea-green-400">
                      {track.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-midnight-green-400 dark:text-tea-green-400">
                    {track.updates ? track.updates.length : 0} updates
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <select
                        value={track.status}
                        onChange={(e) => updateTrackStatus(track.slug, e.target.value as 'draft' | 'published' | 'archived')}
                        className="text-sm border-celadon-300 dark:border-midnight-green-300 rounded px-2 py-1 bg-parchment-500 dark:bg-midnight-green-500 text-midnight-green-500 dark:text-parchment-500"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                      </select>
                      {track.isCompleted && (
                        <span className="px-2 py-1 text-xs rounded-full bg-sea-green-500/10 text-sea-green-500 dark:bg-sea-green-400/10 dark:text-sea-green-400">
                          Completed
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      <Link
                        href={`/build/${track.slug}`}
                        className="text-sea-green-500 dark:text-sea-green-400 hover:text-sea-green-600 dark:hover:text-sea-green-300"
                        target="_blank"
                      >
                        <Eye size={18} />
                      </Link>
                      <Link
                        href={`/admin/build/edit/${track.slug}`}
                        className="text-sea-green-500 dark:text-sea-green-400 hover:text-sea-green-600 dark:hover:text-sea-green-300"
                      >
                        <Pencil size={18} />
                      </Link>
                      <button
                        onClick={() => deleteTrack(track.slug)}
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
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