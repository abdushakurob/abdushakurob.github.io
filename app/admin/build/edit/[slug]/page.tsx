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
  const params = useParams();
  const slug = params.slug as string;
  
  const [loading, setLoading] = useState(false);
  const [loadingTrack, setLoadingTrack] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    links: [] as string[],
    isCompleted: false,
    updates: [] as Update[],
    milestones: [] as Milestone[],
    status: 'draft' as 'draft' | 'published' | 'archived',
    manualDate: '',
  });

  // For new updates
  const [newUpdate, setNewUpdate] = useState({
    title: '',
    content: ''
  });
  
  // For new milestones
  const [newMilestone, setNewMilestone] = useState({
    title: '',
    achieved: false
  });
  
  // For new links
  const [newLink, setNewLink] = useState('');

  useEffect(() => {
    const fetchTrack = async () => {
      try {
        setLoadingTrack(true);
        const response = await axios.get(`/api/build/${slug}`);
        const track = response.data.build; // Access the build property from response.data
        
        setFormData({
          title: track.title || '',
          description: track.description || '',
          category: track.category || 'Other',
          links: track.links || [],
          isCompleted: track.isCompleted || false,
          updates: track.updates || [],
          milestones: track.milestones || [],
          status: track.status || 'draft',
          manualDate: track.manualDate ? new Date(track.manualDate).toISOString().split('T')[0] : '',
        });
      } catch (err) {
        console.error('Error fetching track:', err);
        setError('Failed to load track');
      } finally {
        setLoadingTrack(false);
      }
    };

    fetchTrack();
  }, [slug]);

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
    
    const update = {
      ...newUpdate,
      date: new Date().toISOString()
    };
    
    setFormData({
      ...formData,
      updates: [...formData.updates, update]
    });
    
    setNewUpdate({ title: '', content: '' });
  };

  const removeUpdate = (index: number) => {
    const updates = [...formData.updates];
    updates.splice(index, 1);
    setFormData({ ...formData, updates });
  };

  const handleMilestoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setNewMilestone({ ...newMilestone, [name]: checked });
    } else {
      setNewMilestone({ ...newMilestone, [name]: value });
    }
  };

  const addMilestone = () => {
    if (!newMilestone.title) return;
    
    const milestone = {
      ...newMilestone,
      date: newMilestone.achieved ? new Date().toISOString() : undefined
    };
    
    setFormData({
      ...formData,
      milestones: [...formData.milestones, milestone]
    });
    
    setNewMilestone({ title: '', achieved: false });
  };

  const removeMilestone = (index: number) => {
    const milestones = [...formData.milestones];
    milestones.splice(index, 1);
    setFormData({ ...formData, milestones });
  };

  const toggleMilestone = (index: number) => {
    const milestones = [...formData.milestones];
    milestones[index].achieved = !milestones[index].achieved;
    milestones[index].date = milestones[index].achieved ? new Date().toISOString() : undefined;
    setFormData({ ...formData, milestones });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description) {
      setError('Title and description are required');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      await axios.put(`/api/build/${slug}`, formData);
      router.push('/build');
    } catch (err) {
      console.error('Error updating track:', err);
      setError('Failed to update track');
    } finally {
      setLoading(false);
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      ['clean']
    ],
  };

  if (loadingTrack) {
    return <div className="text-center py-8">Loading track...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Link 
            href="/build" 
            className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={16} />
            <span>Back to Build Tracks</span>
          </Link>
          <h1 className="text-2xl font-bold">Edit Track</h1>
        </div>
        
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          <Save size={16} />
          <span>{loading ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-600 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-md border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Manual Date
            </label>
            <input
              type="date"
              name="manualDate"
              value={formData.manualDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <label htmlFor="isCompleted" className="ml-2 block text-sm text-gray-900">
              Mark as completed
            </label>
          </div>

          {/* Links Section */}
          <div className="col-span-2 mt-6">
            <h3 className="text-lg font-medium mb-2">Links</h3>
            <div className="space-y-2 mb-4">
              {formData.links.map((link, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="text"
                    value={link}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    readOnly
                  />
                  <button
                    type="button"
                    onClick={() => removeLink(index)}
                    className="ml-2 p-2 text-red-600 hover:text-red-900"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex">
              <input
                type="text"
                value={newLink}
                onChange={handleLinkChange}
                placeholder="Add a new link"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={addLink}
                className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Milestones Section */}
          <div className="col-span-2 mt-6">
            <h3 className="text-lg font-medium mb-2">Milestones</h3>
            <div className="space-y-2 mb-4">
              {formData.milestones.map((milestone, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={milestone.achieved}
                    onChange={() => toggleMilestone(index)}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={milestone.title}
                    className="flex-1 ml-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    readOnly
                  />
                  <button
                    type="button"
                    onClick={() => removeMilestone(index)}
                    className="ml-2 p-2 text-red-600 hover:text-red-900"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex">
              <input
                type="text"
                name="title"
                value={newMilestone.title}
                onChange={handleMilestoneChange}
                placeholder="Add a new milestone"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={addMilestone}
                className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Updates Section */}
          <div className="col-span-2 mt-6">
            <h3 className="text-lg font-medium mb-2">Updates</h3>
            <div className="space-y-4 mb-4">
              {formData.updates.map((update, index) => (
                <div key={index} className="border border-gray-200 rounded-md p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">{update.title}</h4>
                    <div className="flex items-center gap-2">
                      <input
                        type="datetime-local"
                        value={new Date(update.date).toISOString().slice(0, 16)}
                        onChange={(e) => {
                          const updates = [...formData.updates];
                          updates[index] = { ...updates[index], date: new Date(e.target.value).toISOString() };
                          setFormData({ ...formData, updates });
                        }}
                        className="text-sm border rounded px-2 py-1"
                      />
                      <button
                        type="button"
                        onClick={() => removeUpdate(index)}
                        className="p-1 text-red-600 hover:text-red-900"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </div>
                  <div dangerouslySetInnerHTML={{ __html: update.content }} />
                </div>
              ))}
            </div>
            <div className="border border-gray-200 rounded-md p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Update Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={newUpdate.title}
                  onChange={handleUpdateChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="What's new?"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Update Content
                </label>
                <div className="border border-gray-300 rounded-md overflow-hidden">
                  <ReactQuill
                    theme="snow"
                    value={newUpdate.content}
                    onChange={handleUpdateContent}
                    modules={modules}
                    placeholder="Write details about this update..."
                    className="h-40"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={addUpdate}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
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