'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

// Import React Quill dynamically to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

export default function EditWritingPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const { slug } = params;
  
  const [loading, setLoading] = useState(false);
  const [loadingWriting, setLoadingWriting] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    tags: '',
    excerpt: '',
    coverImage: '',
    isDraft: true
  });

  useEffect(() => {
    const fetchWriting = async () => {
      try {
        setLoadingWriting(true);
        const response = await axios.get(`/api/writings/${slug}`);
        const writing = response.data.writing; // Note: API returns { writing } object
        
        setFormData({
          title: writing.title || '',
          content: writing.content || '',
          category: writing.category || '',
          tags: writing.tags ? writing.tags.join(', ') : '',
          excerpt: writing.excerpt || '',
          coverImage: writing.coverImage || '',
          isDraft: writing.isDraft || false
        });
      } catch (err) {
        console.error('Error fetching writing:', err);
        setError('Failed to load writing');
      } finally {
        setLoadingWriting(false);
      }
    };

    fetchWriting();
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

  const handleEditorChange = (content: string) => {
    setFormData({
      ...formData,
      content
    });
    
    // Auto-generate excerpt if it's empty
    if (!formData.excerpt) {
      // Strip HTML tags and limit to 150 characters
      const textContent = content.replace(/<[^>]*>/g, '');
      const excerpt = textContent.length > 150 
        ? textContent.substring(0, 150) + '...' 
        : textContent;
        
      setFormData(prev => ({
        ...prev,
        excerpt
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content) {
      setError('Title and content are required');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Transform tags from comma-separated string to array
      const tagsArray = formData.tags 
        ? formData.tags.split(',').map(tag => tag.trim()) 
        : [];
      
      const writingData = {
        ...formData,
        tags: tagsArray
      };
      
      await axios.put(`/api/writings/${slug}`, writingData);
      router.push('/admin/writings');
    } catch (err) {
      console.error('Error updating writing:', err);
      setError('Failed to update writing');
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

  if (loadingWriting) {
    return <div className="text-center py-8">Loading writing...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Link 
            href="/admin/writings" 
            className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={16} />
            <span>Back to Writings</span>
          </Link>
          <h1 className="text-2xl font-bold">Edit Writing</h1>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="tech, tutorial, javascript"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cover Image URL
            </label>
            <input
              type="text"
              name="coverImage"
              value={formData.coverImage}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <div className="flex items-center h-full">
              <input
                type="checkbox"
                id="isDraft"
                name="isDraft"
                checked={formData.isDraft}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <label htmlFor="isDraft" className="ml-2 block text-sm text-gray-900">
                Save as draft (won't be published)
              </label>
            </div>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Excerpt
            </label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content <span className="text-red-500">*</span>
            </label>
            <div className="h-96 border border-gray-300 rounded-md overflow-hidden">
              <ReactQuill
                theme="snow"
                value={formData.content}
                onChange={handleEditorChange}
                modules={modules}
                className="h-full"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
} 