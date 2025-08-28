// src/components/LifeInsuranceModal.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LifeInsuranceModal = ({ agentId, initialData, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    Description: '',
    IconName: '',
    ColorClass: '',
    AgeRange: '',
    MinPremium: '',
    popular: false,
    AgentId: agentId,
    features: [],
    plans: []
  });
  
  const [newFeature, setNewFeature] = useState('');
  const [newPlan, setNewPlan] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

 useEffect(() => {
  if (initialData) {
    setFormData({
      title: initialData.Title || '',
      subtitle: initialData.Subtitle || '',
      Description: initialData.Description || '',
      IconName: initialData.IconName || '',
      ColorClass: initialData.ColorClass || '',
      AgeRange: initialData.AgeRange || '',
      MinPremium: initialData.MinPremium || '',
      popular: initialData.Popular || false,
      AgentId: agentId,
      features: initialData.Features || [],  
      plans: initialData.Plans || []         
    });
  }
}, [initialData, agentId]);


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleAddPlan = () => {
    if (newPlan.trim()) {
      setFormData(prev => ({
        ...prev,
        plans: [...prev.plans, newPlan.trim()]
      }));
      setNewPlan('');
    }
  };

  const handleRemovePlan = (index) => {
    setFormData(prev => ({
      ...prev,
      plans: prev.plans.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const payload = {
        ...formData,
        agentId: agentId
      };
      
      if (initialData) {
        // Update existing insurance
        await axios.put(`${API_BASE_URL}/api/lifeinsurance/${initialData.id}`, payload);
      } else {
        // Create new insurance
        await axios.post(`${API_BASE_URL}/api/lifeinsurance`, payload);
      }
      
      onSubmit();
      onClose();
    } catch (err) {
      console.error('Error saving insurance:', err);
      setError('Failed to save insurance product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
        <div className="border-b p-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">
            {initialData ? 'Edit Insurance Product' : 'Create New Insurance Product'}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
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
                <input
                  type="text"
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.Description}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                rows="3"
                required
              />
            </div>
            
            <div className="grid">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icon Name</label>
                <input
                  type="text"
                  name="IconName"
                  value={formData.IconName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age Range</label>
                <input
                  type="text"
                  name="AgeRange"
                  value={formData.AgeRange}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Premium</label>
                <input
                  type="text"
                  name="MinPremium"
                  value={formData.MinPremium}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div className="flex items-end">
                <div className="flex items-center">
                  <input
                    id="popular"
                    name="popular"
                    type="checkbox"
                    checked={formData.popular}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="popular" className="ml-2 block text-sm text-gray-700">
                    Popular Product
                  </label>
                </div>
              </div>
            </div>
            
            {/* Features Section */}
            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-md font-medium text-gray-700 mb-3">Features</h4>
              
              <div className="flex mb-3">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Add a feature"
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-r-lg hover:bg-indigo-700"
                >
                  Add
                </button>
              </div>
              
              <div className="space-y-2">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded-lg">
                    <span>{feature}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                
                {formData.features.length === 0 && (
                  <p className="text-gray-500 text-sm">No features added yet</p>
                )}
              </div>
            </div>
            
            {/* Plans Section */}
            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-md font-medium text-gray-700 mb-3">Plans</h4>
              
              <div className="flex mb-3">
                <input
                  type="text"
                  value={newPlan}
                  onChange={(e) => setNewPlan(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Add a plan"
                />
                <button
                  type="button"
                  onClick={handleAddPlan}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-r-lg hover:bg-indigo-700"
                >
                  Add
                </button>
              </div>
              
              <div className="space-y-2">
                {formData.plans.map((plan, index) => (
                  <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded-lg">
                    <span>{plan}</span>
                    <button
                      type="button"
                      onClick={() => handleRemovePlan(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                
                {formData.plans.length === 0 && (
                  <p className="text-gray-500 text-sm">No plans added yet</p>
                )}
              </div>
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
              className={`px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 ${
                isLoading ? 'opacity-75 cursor-not-allowed' : ''
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

export default LifeInsuranceModal;