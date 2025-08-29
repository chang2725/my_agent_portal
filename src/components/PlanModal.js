import React, { useState, useEffect } from 'react';

const PlanModal = ({ agentId, initialData, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    minEntryAge: 0,
    maxEntryAge: 0,
    maturityAge: 0,
    minSumAssured: 0,
    maxSumAssured: 0,
    premiumPaymentTerm: '',
    policyTerm: '',
    features: [],
    benefits: [],
    eligibility: '',
    documentsRequired: [],
    popularity: '',
    claimSettlementRatio: '',
    agentId: agentId
  });

  const [tempFeature, setTempFeature] = useState('');
  const [tempBenefit, setTempBenefit] = useState('');
  const [tempDocument, setTempDocument] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [planData, setPlanData] = useState({}); 
  const [categories, setCategories] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

  useEffect(() => {
    if (initialData) {
       setFormData({
        ...initialData,
        features: initialData.features || [],
        benefits: initialData.benefits || [],
        documentsRequired: initialData.documentsRequired || []
      });
    } else {
       fetchPlanOptions();
    }
  }, [initialData]);

 const fetchPlanOptions = async () => {
  try {
    setIsLoading(true);
    const response = await fetch(`${API_BASE_URL}/api/Plans/planList/${agentId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch plan options');
    }
    
    const result = await response.json();
    
    if (result.status === 200 && result.data && Array.isArray(result.data)) {
      const categoryPlanMapping = {};
      const categoryList = [];

      result.data.forEach(item => {
        const { title, plan_Name } = item;
        const planNames = JSON.parse(plan_Name); // JSON_ARRAYAGG returns stringified JSON

        categoryPlanMapping[title] = planNames;
        categoryList.push(title);
      });

      setPlanData(categoryPlanMapping);
      setCategories(categoryList);

      // If we only have one category, auto-select it
      if (categoryList.length === 1) {
        const singleCategory = categoryList[0];
        setFormData(prev => ({ ...prev, category: singleCategory }));
        setFilteredPlans(categoryPlanMapping[singleCategory]);
      }
    }
  } catch (error) {
    console.error('Error fetching plan options:', error);
    setError('Failed to load plan options');
  } finally {
    setIsLoading(false);
  }
};

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setFormData(prev => ({ ...prev, category, name: '' }));
    
    // Filter plans based on selected category
    if (planData[category]) {
      setFilteredPlans(planData[category]);
    } else {
      setFilteredPlans([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddFeature = () => {
    if (tempFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, tempFeature.trim()]
      }));
      setTempFeature('');
    }
  };

  const handleRemoveFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleAddBenefit = () => {
    if (tempBenefit.trim()) {
      setFormData(prev => ({
        ...prev,
        benefits: [...prev.benefits, tempBenefit.trim()]
      }));
      setTempBenefit('');
    }
  };

  const handleRemoveBenefit = (index) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index)
    }));
  };

  const handleAddDocument = () => {
    if (tempDocument.trim()) {
      setFormData(prev => ({
        ...prev,
        documentsRequired: [...prev.documentsRequired, tempDocument.trim()]
      }));
      setTempDocument('');
    }
  };

  const handleRemoveDocument = (index) => {
    setFormData(prev => ({
      ...prev,
      documentsRequired: prev.documentsRequired.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Simulate API call - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSubmit(formData);
      onClose();
    } catch (err) {
      console.error('Error saving plan:', err);
      setError('Failed to save plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isEditMode = !!initialData;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-auto">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="border-b p-4 flex justify-between items-center sticky top-0 bg-white">
          <h3 className="text-lg font-semibold text-gray-800">
            {isEditMode ? 'Edit Insurance Plan' : 'Create New Insurance Plan'}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">{error}</div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              {isEditMode ? (
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                  disabled
                />
              ) : (
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleCategoryChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                  disabled={isLoading}
                >
                  <option value="">Select Category</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>{category}</option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
              {isEditMode ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                  disabled
                />
              ) : (
                <select
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                  disabled={!formData.category || isLoading}
                >
                  <option value="">Select Plan</option>
                  {filteredPlans.map((plan, index) => (
                    <option key={index} value={plan}>{plan}</option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Entry Age</label>
              <input
                type="number"
                name="minEntryAge"
                value={formData.minEntryAge}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Entry Age</label>
              <input
                type="number"
                name="maxEntryAge"
                value={formData.maxEntryAge}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Maturity Age</label>
              <input
                type="number"
                name="maturityAge"
                value={formData.maturityAge}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Sum Assured</label>
              <input
                type="number"
                name="minSumAssured"
                value={formData.minSumAssured}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Sum Assured</label>
              <input
                type="number"
                name="maxSumAssured"
                value={formData.maxSumAssured}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Premium Payment Term</label>
              <input
                type="text"
                name="premiumPaymentTerm"
                value={formData.premiumPaymentTerm}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Policy Term</label>
              <input
                type="text"
                name="policyTerm"
                value={formData.policyTerm}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Popularity</label>
              <input
                type="text"
                name="popularity"
                value={formData.popularity}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Claim Settlement Ratio</label>
              <input
                type="text"
                name="claimSettlementRatio"
                value={formData.claimSettlementRatio}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              rows="3"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Eligibility</label>
            <textarea
              name="eligibility"
              value={formData.eligibility}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              rows="2"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Features</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tempFeature}
                onChange={(e) => setTempFeature(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Add a feature"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Add
              </button>
            </div>
            <ul className="bg-gray-50 rounded-lg p-2 min-h-[60px]">
              {formData.features.length === 0 ? (
                <li className="text-gray-500 text-sm py-2">No features added yet</li>
              ) : (
                formData.features.map((feature, index) => (
                  <li key={index} className="flex justify-between items-center py-1 px-2 bg-white rounded mb-1">
                    <span className="text-sm">{feature}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(index)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Benefits</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tempBenefit}
                onChange={(e) => setTempBenefit(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddBenefit())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Add a benefit"
              />
              <button
                type="button"
                onClick={handleAddBenefit}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Add
              </button>
            </div>
            <ul className="bg-gray-50 rounded-lg p-2 min-h-[60px]">
              {formData.benefits.length === 0 ? (
                <li className="text-gray-500 text-sm py-2">No benefits added yet</li>
              ) : (
                formData.benefits.map((benefit, index) => (
                  <li key={index} className="flex justify-between items-center py-1 px-2 bg-white rounded mb-1">
                    <span className="text-sm">{benefit}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveBenefit(index)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Documents Required</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tempDocument}
                onChange={(e) => setTempDocument(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddDocument())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Add a document"
              />
              <button
                type="button"
                onClick={handleAddDocument}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Add
              </button>
            </div>
            <ul className="bg-gray-50 rounded-lg p-2 min-h-[60px]">
              {formData.documentsRequired.length === 0 ? (
                <li className="text-gray-500 text-sm py-2">No documents added yet</li>
              ) : (
                formData.documentsRequired.map((doc, index) => (
                  <li key={index} className="flex justify-between items-center py-1 px-2 bg-white rounded mb-1">
                    <span className="text-sm">{doc}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveDocument(index)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              disabled={isLoading}
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
              {isLoading ? 'Saving...' : (isEditMode ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlanModal;