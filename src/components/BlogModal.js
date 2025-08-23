// src/components/BlogModal.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BlogModal = ({ agentId, initialData, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    category: 'Others',
    author: '',
    publishedDate: new Date().toISOString().split('T')[0],
    imageUrl: '',
    sortingOrder: '',
    AgentId: agentId
  });
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        excerpt: initialData.excerpt || '',
        category: initialData.category || '',
        author: initialData.author || '',
        publishedDate: initialData.publishedDate ?
          initialData.publishedDate.split('T')[0] :
          new Date().toISOString().split('T')[0],
        imageUrl: initialData.imageUrl || '',
        sortingOrder: initialData.sortingOrder || '',
        AgentId: agentId
      });
    }
  }, [initialData, agentId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        publishedDate: new Date(formData.publishedDate).toISOString()
      };

      if (initialData) {
        // Update existing blog
        await axios.put(`${API_BASE_URL}/api/blog/${initialData.id}`, payload);
      } else {
        // Create new blog
        await axios.post(`${API_BASE_URL}/api/blog`, payload);
      }

      onSubmit();
      onClose();
    } catch (err) {
      console.error('Error saving blog:', err);
      setError('Failed to save blog. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="border-b p-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">
            {initialData ? 'Edit Blog Post' : 'Create New Blog Post'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                rows="3"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                >
                  <option value="Others">Others</option>
                  <option value="Life Insurance">Life Insurance</option>
                  <option value="Tax Planning">Tax Planning</option>
                  <option value="Financial Planning">Financial Planning</option>
                  <option value="Investment">Investment</option>
                  <option value="Retirement">Retirement</option>
                  <option value="Wealth Management">Wealth Management</option>
                </select>
              </div>


              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Published Date</label>
                <input
                  type="date"
                  name="publishedDate"
                  value={formData.publishedDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sorting Order</label>
                <input
                  type="number"
                  name="sortingOrder"
                  value={formData.sortingOrder}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''
                }`}
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogModal;