// src/components/HeroSectionModal.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const HeroSectionModal = ({ agentId, initialData, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    actionText: '',
    actionLink: '',
    imageUrl: '',
    AgentId: agentId
  });
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        subtitle: initialData.subtitle || '',
        actionText: initialData.actionText || '',
        actionLink: initialData.actionLink || '',
        imageUrl: initialData.imageUrl || '',
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
    if (!formData.AgentId) {
      setError('section time out. Please login again.');
      navigate('/login');
      return;
    }
    try {
      if (initialData) {
        // Update existing hero section
        await axios.put(`${API_BASE_URL}/api/herosection/${initialData.id}`, formData);
      } else {
        // Create new hero section
        await axios.post(`${API_BASE_URL}/api/herosection`, formData);
      }

      onSubmit();
      onClose();
    } catch (err) {
      console.error('Error saving hero section:', err);
      setError('Failed to save hero section. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="border-b p-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">
            {initialData ? 'Edit Hero Section' : 'Create New Hero Section'}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
              <textarea
                name="subtitle"
                value={formData.subtitle}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                rows="2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Action Text</label>
              <input
                type="text"
                name="actionText"
                value={formData.actionText}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Action Link</label>

              <input
                list="actionLinkOptions"
                type="text"
                name="actionLink"
                value={formData.actionLink}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />

              <datalist id="actionLinkOptions">
                <option value="/contact" />
                <option value="/blog" />
                <option value="/life-insurance" />
              </datalist>
            </div>


            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
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

export default HeroSectionModal;