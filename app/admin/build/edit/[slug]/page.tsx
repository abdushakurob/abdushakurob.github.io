'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { ArrowLeft, Save, Plus, Trash } from 'lucide-react';
import Link from 'next/link';

// Import React Quill dynamically to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import 'react-quill-new/dist/quill.snow.css';

interface Update {
  title: string;
  content: string;
  date: string;
}

interface Milestone {
  title: string;
  achieved: boolean;
  date?: string;
}

export default function EditTrackPage() {
  const router = useRouter();
  const { slug } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    status: 'draft' as 'draft' | 'published' | 'archived',
    links: [] as string[],
    isCompleted: false,
    milestones: [] as Milestone[],
    manualDate: '',
    updates: [] as Update[]
  });
  const [newUpdate, setNewUpdate] = useState({
    title: '',
    content: ''
  });
  const [newMilestone, setNewMilestone] = useState({
    title: '',
    achieved: false
  });
  const [newLink, setNewLink] = useState('');

  useEffect(() => {
    fetchTrack();
  }, [slug]);

  const fetchTrack = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/build/${slug}`);
      setFormData(response.data);
    } catch (err) {
      console.error('Error fetching track:', err);
      setError('Failed to fetch track');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.put(`/api/build/${slug}`, formData);
      router.push('/admin/build');
    } catch (err) {
      console.error('Error updating track:', err);
      setError('Failed to update track');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleUpdateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewUpdate({ ...newUpdate, [name]: value });
  };

  const handleUpdateContent = (content: string) => {
    setNewUpdate({ ...newUpdate, content });
  };

  const addUpdate = () => {
    if (!newUpdate.title || !newUpdate.content) return;
    
    setFormData({
      ...formData,
      updates: [
        ...formData.updates,
        { ...newUpdate, date: new Date().toISOString() }
      ]
    });
    
    setNewUpdate({ title: '', content: '' });
  };

  const removeUpdate = (index: number) => {
    const updates = [...formData.updates];
    updates.splice(index, 1);
    setFormData({ ...formData, updates });
  };

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewLink(e.target.value);
  };

  const addLink = () => {
    if (!newLink) return;
    
    setFormData({
      ...formData,
      links: [...formData.links, newLink]
    });
    
    setNewLink('');
  };

  const removeLink = (index: number) => {
    const links = [...formData.links];
    links.splice(index, 1);
    setFormData({ ...formData, links });
  };

  const handleMilestoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setNewMilestone({
      ...newMilestone,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const addMilestone = () => {
    if (!newMilestone.title) return;
    
    setFormData({
      ...formData,
      milestones: [
        ...formData.milestones,
        { ...newMilestone }
      ]
    });
    
    setNewMilestone({ title: '', achieved: false });
  };

  const removeMilestone = (index: number) => {
    const milestones = [...formData.milestones];
    milestones.splice(index, 1);
    setFormData({ ...formData, milestones });
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['blockquote', 'code-block'],
      ['link'],
      ['clean']
    ],
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-midnight-green-400 dark:text-tea-green-400">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Link 
            href="/admin/build" 
            className="flex items-center gap-1 text-midnight-green-400 dark:text-tea-green-400 hover:text-sea-green-500 dark:hover:text-sea-green-400"
          >
            <ArrowLeft size={16} />
            <span>Back to Build Tracks</span>
          </Link>
        </div>
        
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-sea-green-500 dark:bg-sea-green-400 text-parchment-500 dark:text-midnight-green-500 rounded-md hover:bg-sea-green-600 dark:hover:bg-sea-green-300 disabled:opacity-50 transition-colors"
        >
          <Save size={16} />
          <span>{loading ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-200 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-midnight-green-500 dark:text-parchment-500 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-tea-green-300 dark:bg-midnight-green-400 border border-celadon-300 dark:border-midnight-green-300 rounded-md text-midnight-green-500 dark:text-parchment-500 focus:outline-none focus:ring-2 focus:ring-sea-green-500 dark:focus:ring-sea-green-400"
              required
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-midnight-green-500 dark:text-parchment-500 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 bg-tea-green-300 dark:bg-midnight-green-400 border border-celadon-300 dark:border-midnight-green-300 rounded-md text-midnight-green-500 dark:text-parchment-500 focus:outline-none focus:ring-2 focus:ring-sea-green-500 dark:focus:ring-sea-green-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-midnight-green-500 dark:text-parchment-500 mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-tea-green-300 dark:bg-midnight-green-400 border border-celadon-300 dark:border-midnight-green-300 rounded-md text-midnight-green-500 dark:text-parchment-500 focus:outline-none focus:ring-2 focus:ring-sea-green-500 dark:focus:ring-sea-green-400"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-midnight-green-500 dark:text-parchment-500 mb-1">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-tea-green-300 dark:bg-midnight-green-400 border border-celadon-300 dark:border-midnight-green-300 rounded-md text-midnight-green-500 dark:text-parchment-500 focus:outline-none focus:ring-2 focus:ring-sea-green-500 dark:focus:ring-sea-green-400"
            >
              <option value="Web Dev">Web Dev</option>
              <option value="Branding">Branding</option>
              <option value="Learning">Learning</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="flex items-center h-full">
            <input
              type="checkbox"
              id="isCompleted"
              name="isCompleted"
              checked={formData.isCompleted}
              onChange={handleChange}
              className="h-4 w-4 text-sea-green-500 dark:text-sea-green-400 bg-tea-green-300 dark:bg-midnight-green-400 border-celadon-300 dark:border-midnight-green-300 rounded focus:ring-sea-green-500 dark:focus:ring-sea-green-400"
            />
            <label htmlFor="isCompleted" className="ml-2 block text-sm text-midnight-green-500 dark:text-parchment-500">
              Mark as completed
            </label>
          </div>

          {/* Links Section */}
          <div className="col-span-2 mt-6">
            <h2 className="text-lg font-medium text-midnight-green-500 dark:text-parchment-500 mb-2">Links</h2>
            <div className="flex mb-2">
              <input
                type="text"
                value={newLink}
                onChange={handleLinkChange}
                placeholder="Add a link..."
                className="flex-1 px-3 py-2 bg-tea-green-300 dark:bg-midnight-green-400 border border-celadon-300 dark:border-midnight-green-300 rounded-l-md text-midnight-green-500 dark:text-parchment-500 focus:outline-none focus:ring-2 focus:ring-sea-green-500 dark:focus:ring-sea-green-400"
              />
              <button
                type="button"
                onClick={addLink}
                className="bg-sea-green-500 dark:bg-sea-green-400 text-parchment-500 dark:text-midnight-green-500 px-3 py-2 rounded-r-md hover:bg-sea-green-600 dark:hover:bg-sea-green-300 focus:outline-none transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
            
            {formData.links.length > 0 && (
              <ul className="space-y-1">
                {formData.links.map((link, idx) => (
                  <li key={idx} className="flex justify-between items-center p-2 rounded bg-tea-green-300/50 dark:bg-midnight-green-300/50">
                    <span className="truncate text-midnight-green-500 dark:text-parchment-500">{link}</span>
                    <button 
                      type="button"
                      onClick={() => removeLink(idx)}
                      className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Milestones Section */}
          <div className="col-span-2">
            <h2 className="text-lg font-medium text-midnight-green-500 dark:text-parchment-500 mb-2">Milestones</h2>
            <div className="flex mb-2 gap-2">
              <input
                type="text"
                value={newMilestone.title}
                onChange={handleMilestoneChange}
                name="title"
                placeholder="Milestone title..."
                className="flex-1 px-3 py-2 bg-tea-green-300 dark:bg-midnight-green-400 border border-celadon-300 dark:border-midnight-green-300 rounded-md text-midnight-green-500 dark:text-parchment-500 focus:outline-none focus:ring-2 focus:ring-sea-green-500 dark:focus:ring-sea-green-400"
              />
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="achieved"
                  name="achieved"
                  checked={newMilestone.achieved}
                  onChange={handleMilestoneChange}
                  className="h-4 w-4 text-sea-green-500 dark:text-sea-green-400 bg-tea-green-300 dark:bg-midnight-green-400 border-celadon-300 dark:border-midnight-green-300 rounded focus:ring-sea-green-500 dark:focus:ring-sea-green-400"
                />
                <label htmlFor="achieved" className="ml-2 text-sm text-midnight-green-500 dark:text-parchment-500">
                  Achieved
                </label>
              </div>
              <button
                type="button"
                onClick={addMilestone}
                className="bg-sea-green-500 dark:bg-sea-green-400 text-parchment-500 dark:text-midnight-green-500 px-4 py-2 rounded-md hover:bg-sea-green-600 dark:hover:bg-sea-green-300 focus:outline-none transition-colors"
              >
                Add
              </button>
            </div>

            {formData.milestones.length > 0 && (
              <ul className="space-y-2">
                {formData.milestones.map((milestone, idx) => (
                  <li key={idx} className="flex items-center justify-between p-2 rounded bg-tea-green-300/50 dark:bg-midnight-green-300/50">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={milestone.achieved}
                        onChange={() => {
                          const milestones = [...formData.milestones];
                          milestones[idx].achieved = !milestones[idx].achieved;
                          setFormData({ ...formData, milestones });
                        }}
                        className="h-4 w-4 text-sea-green-500 dark:text-sea-green-400 bg-tea-green-300 dark:bg-midnight-green-400 border-celadon-300 dark:border-midnight-green-300 rounded focus:ring-sea-green-500 dark:focus:ring-sea-green-400"
                      />
                      <span className="ml-2 text-midnight-green-500 dark:text-parchment-500">{milestone.title}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeMilestone(idx)}
                      className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Updates Section */}
          <div className="col-span-2 mt-6">
            <h3 className="text-lg font-medium text-midnight-green-500 dark:text-parchment-500 mb-2">Updates</h3>
            <div className="space-y-4 mb-4">
              {formData.updates.map((update, index) => (
                <div key={index} className="border border-celadon-300 dark:border-midnight-green-300 rounded-md p-4 bg-tea-green-300/50 dark:bg-midnight-green-300/50">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-midnight-green-500 dark:text-parchment-500">{update.title}</h4>
                    <div className="flex items-center gap-2">
                      <input
                        type="datetime-local"
                        value={new Date(update.date).toISOString().slice(0, 16)}
                        onChange={(e) => {
                          const updates = [...formData.updates];
                          updates[index] = { ...updates[index], date: new Date(e.target.value).toISOString() };
                          setFormData({ ...formData, updates });
                        }}
                        className="text-sm border-celadon-300 dark:border-midnight-green-300 rounded px-2 py-1 bg-tea-green-300 dark:bg-midnight-green-400 text-midnight-green-500 dark:text-parchment-500"
                      />
                      <button
                        type="button"
                        onClick={() => removeUpdate(index)}
                        className="p-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="prose prose-sm max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: update.content }} />
                </div>
              ))}
            </div>
            <div className="border border-celadon-300 dark:border-midnight-green-300 rounded-md p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-midnight-green-500 dark:text-parchment-500 mb-1">
                  Update Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={newUpdate.title}
                  onChange={handleUpdateChange}
                  className="w-full px-3 py-2 bg-tea-green-300 dark:bg-midnight-green-400 border border-celadon-300 dark:border-midnight-green-300 rounded-md text-midnight-green-500 dark:text-parchment-500 focus:outline-none focus:ring-2 focus:ring-sea-green-500 dark:focus:ring-sea-green-400"
                  placeholder="What's new?"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-midnight-green-500 dark:text-parchment-500 mb-1">
                  Update Content
                </label>
                <div className="border border-celadon-300 dark:border-midnight-green-300 rounded-md overflow-hidden">
                  <ReactQuill
                    theme="snow"
                    value={newUpdate.content}
                    onChange={handleUpdateContent}
                    modules={modules}
                    placeholder="Write details about this update..."
                    className="h-40 bg-tea-green-300 dark:bg-midnight-green-400 text-midnight-green-500 dark:text-parchment-500"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={addUpdate}
                className="flex items-center gap-2 px-4 py-2 bg-sea-green-500 dark:bg-sea-green-400 text-parchment-500 dark:text-midnight-green-500 rounded-md hover:bg-sea-green-600 dark:hover:bg-sea-green-300 transition-colors"
              >
                <Plus size={16} />
                <span>Add Update</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}