'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Pencil, Trash2, Plus, Eye } from 'lucide-react';
import axios from 'axios';

interface Writing {
  _id: string;
  title: string;
  excerpt: string;
  category: string;
  slug: string;
  createdAt: string;
  isDraft: boolean;
  readingTime: number;
}

export default function WritingsPage() {
  const [writings, setWritings] = useState<Writing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWritings();
  }, []);

  const fetchWritings = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/writings');
      setWritings(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch writings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteWriting = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this writing?')) return;
    
    try {
      await axios.delete(`/api/writings/${slug}`);
      setWritings(writings.filter(writing => writing.slug !== slug));
    } catch (err) {
      setError('Failed to delete writing');
      console.error(err);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Writings</h1>
        <Link 
          href="/admin/writings/new" 
          className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus size={16} />
          <span>Add Writing</span>
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading writings...</div>
      ) : error ? (
        <div className="bg-red-100 text-red-600 p-4 rounded-md">{error}</div>
      ) : writings.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-md">
          <p className="text-gray-500">No writings found</p>
          <Link 
            href="/admin/writings/new" 
            className="mt-4 inline-block text-blue-600 hover:underline"
          >
            Create your first writing
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-md overflow-hidden border border-gray-200">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {writings.map((writing) => (
                <tr key={writing._id}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{writing.title}</div>
                    <div className="text-sm text-gray-500">{writing.readingTime} min read</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {writing.category || 'Uncategorized'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(writing.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {writing.isDraft ? (
                      <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Draft</span>
                    ) : (
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Published</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <Link
                        href={`/writings/${writing.slug}`}
                        className="text-blue-600 hover:text-blue-900"
                        target="_blank"
                      >
                        <Eye size={18} />
                      </Link>
                      <Link
                        href={`/admin/writings/edit/${writing.slug}`}
                        className="text-yellow-600 hover:text-yellow-900"
                      >
                        <Pencil size={18} />
                      </Link>
                      <button
                        onClick={() => deleteWriting(writing.slug)}
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