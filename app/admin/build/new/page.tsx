'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { ArrowLeft, Save, Plus } from 'lucide-react';
import Link from 'next/link';

// Use dynamic import without any findDOMNode workarounds
const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import('react-quill-new');
    return RQ;
  },
  { ssr: false }
);
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

export default function NewBuildTrackPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    links: [] as string[],
    isCompleted: false,
    updates: [] as Update[],
    milestones: [] as Milestone[]
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
      
      await axios.post('/api/build', formData);
      router.push('/build');
    } catch (err) {
      console.error('Error creating track:', err);
      setError('Failed to create track');
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
          <h1 className="text-2xl font-bold">Create New Track</h1>
        </div>
        
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          <Save size={16} />
          <span>{loading ? 'Saving...' : 'Save Track'}</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-600 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-md border border-gray-200 p-6 space-y-6">
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
              Category
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
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
                Mark as Completed
              </label>
            </div>
          </div>
        </div>

        {/* Links Section */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-2">Links</h2>
          <div className="flex mb-2">
            <input
              type="text"
              value={newLink}
              onChange={handleLinkChange}
              placeholder="Add a link..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={addLink}
              className="bg-blue-600 text-white px-3 py-2 rounded-r-md hover:bg-blue-700 focus:outline-none"
            >
              <Plus size={16} />
            </button>
          </div>
          
          {formData.links.length > 0 && (
            <ul className="space-y-1">
              {formData.links.map((link, idx) => (
                <li key={idx} className="flex justify-between items-center p-2 rounded bg-gray-100">
                  <span className="truncate">{link}</span>
                  <button 
                    type="button"
                    onClick={() => removeLink(idx)}
                    className="text-red-600 hover:text-red-800 ml-2"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Milestones Section */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-2">Milestones</h2>
          <div className="flex mb-2 gap-2">
            <input
              type="text"
              value={newMilestone.title}
              onChange={handleMilestoneChange}
              name="title"
              placeholder="Milestone title..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex items-center">
              <input
                type="checkbox"
                id="achieved"
                name="achieved"
                checked={newMilestone.achieved}
                onChange={handleMilestoneChange}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <label htmlFor="achieved" className="ml-2 whitespace-nowrap">
                Achieved
              </label>
            </div>
            <button
              type="button"
              onClick={addMilestone}
              className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 focus:outline-none"
            >
              <Plus size={16} />
            </button>
          </div>
          
          {formData.milestones.length > 0 && (
            <ul className="space-y-1">
              {formData.milestones.map((milestone, idx) => (
                <li key={idx} className="flex justify-between items-center p-2 rounded bg-gray-100">
                  <span className="flex items-center">
                    <span className={`mr-2 ${milestone.achieved ? 'text-green-600' : 'text-gray-400'}`}>
                      {milestone.achieved ? '✓' : '○'}
                    </span>
                    <span>{milestone.title}</span>
                  </span>
                  <button 
                    type="button"
                    onClick={() => removeMilestone(idx)}
                    className="text-red-600 hover:text-red-800 ml-2"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Updates Section */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-2">Updates</h2>
          <div className="space-y-2 mb-2">
            <input
              type="text"
              value={newUpdate.title}
              onChange={handleUpdateChange}
              name="title"
              placeholder="Update title..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="h-48 border border-gray-300 rounded-md overflow-hidden">
              <ReactQuill
                theme="snow"
                value={newUpdate.content}
                onChange={handleUpdateContent}
                modules={modules}
                className="h-full"
              />
            </div>
            <button
              type="button"
              onClick={addUpdate}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none inline-flex items-center"
            >
              <Plus size={16} className="mr-1" />
              <span>Add Update</span>
            </button>
          </div>
          
          {formData.updates.length > 0 && (
            <div className="space-y-4">
              {formData.updates.map((update, idx) => (
                <div key={idx} className="p-4 rounded bg-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">{update.title}</h3>
                    <button 
                      type="button"
                      onClick={() => removeUpdate(idx)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: update.content }} />
                </div>
              ))}
            </div>
          )}
        </div>
      </form>
    </div>
  );
} 