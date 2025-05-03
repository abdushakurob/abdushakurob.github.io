'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import 'react-quill-new/dist/quill.snow.css';

interface Writing {
  _id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  excerpt: string;
  coverImage: string;
  readingTime: string;
  isDraft: boolean;
  status: 'draft' | 'published' | 'archived';
  publishedAt?: string;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export default function EditWritingPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const [loading, setLoading] = useState(false);
  const [loadingWriting, setLoadingWriting] = useState(true);
  const [error, setError] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    tags: [] as string[],
    readingTime: '',
    excerpt: '',
    coverImage: '',
    isDraft: true,
    status: 'draft' as 'draft' | 'published' | 'archived',
    seo: {
      title: '',
      description: '',
      keywords: [] as string[],
    }
  });

  useEffect(() => {
    const fetchWriting = async () => {
      try {
        setLoadingWriting(true);
        const response = await axios.get(`/api/writings/${slug}`);
        const writing = response.data.writing;

        setFormData({
          title: writing.title || '',
          content: writing.content || '',
          category: writing.category || '',
          tags: writing.tags || [],
          readingTime: writing.readingTime?.toString() || '',
          excerpt: writing.excerpt || '',
          coverImage: writing.coverImage || '',
          isDraft: writing.isDraft || false,
          status: writing.status || 'draft',
          seo: writing.seo || { title: '', description: '', keywords: [] }
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

      const readingTimeNum = formData.readingTime ? parseInt(formData.readingTime) : undefined;

      const writingData = {
        title: formData.title,
        content: formData.content,
        category: formData.category,
        tags: formData.tags,
        readingTime: readingTimeNum,
        excerpt: formData.excerpt,
        coverImage: formData.coverImage,
        isDraft: formData.isDraft,
        status: formData.status,
        seo: formData.seo
      };

      await axios.put(`/api/writings/${slug}`, writingData);
      router.push('/writings');
    } catch (err) {
      console.error('Error updating writing:', err);
      setError('Failed to update writing');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()]
        }));
        setTagInput('');
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
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
            href="/writings"
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
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Type a tag and press Enter"
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

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Publishing Settings</label>
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="status" className="block text-sm text-gray-600">Status</label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div className="flex items-center ml-6">
                  <input
                    type="checkbox"
                    id="isDraft"
                    name="isDraft"
                    checked={formData.isDraft}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <label htmlFor="isDraft" className="ml-2 block text-sm text-gray-900">
                    Save as draft
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">SEO Metadata</label>
                <div className="space-y-3">
                  <div>
                    <label htmlFor="seoTitle" className="block text-xs text-gray-500">Title</label>
                    <input
                      type="text"
                      id="seoTitle"
                      value={formData.seo.title}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        seo: { ...prev.seo, title: e.target.value }
                      }))}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Leave blank to use post title"
                    />
                  </div>

                  <div>
                    <label htmlFor="seoDescription" className="block text-xs text-gray-500">Description</label>
                    <textarea
                      id="seoDescription"
                      value={formData.seo.description}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        seo: { ...prev.seo, description: e.target.value }
                      }))}
                      rows={2}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Leave blank to use excerpt"
                    />
                  </div>
                </div>
              </div>
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
              placeholder="Brief summary of the post (will be auto-generated if left empty)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reading Time (minutes)
            </label>
            <input
              type="number"
              name="readingTime"
              value={formData.readingTime}
              onChange={handleChange}
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