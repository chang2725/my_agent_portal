import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PolicyHolderModal = ({ agentId, initialData, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    policyHolderName: '',
    contactNumber: '',
    policyName: '',
    amountPerCycle: '',
    paymentCycle: 'Monthly',
    status: 'Active',
    remarks: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

  // Initialize form with data if editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        policyHolderName: initialData.PolicyHolderName || '',
        contactNumber: initialData.ContactNumber || '',
        policyName: initialData.PolicyName || '',
        amountPerCycle: initialData.AmountPerCycle || '',
        paymentCycle: initialData.PaymentCycle || 'Monthly',
        status: initialData.Status || 'Active',
        remarks: initialData.Remarks || ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const payload = {
        PolicyHolderName: formData.policyHolderName,
        ContactNumber: formData.contactNumber,
        PolicyName: formData.policyName,
        AmountPerCycle: parseFloat(formData.amountPerCycle),
        PaymentCycle: formData.paymentCycle,
        Status: formData.status,
        Remarks: formData.remarks,
        AgentId: agentId
      };

      if (initialData) {
        // Update existing policy holder
        await axios.put(
          `${API_BASE_URL}/api/PolicyHolderDetail/${initialData.PolicyHolderId}`, 
          payload
        );
      } else {
        // Create new policy holder
        await axios.post(
          `${API_BASE_URL}/api/PolicyHolderDetail`, 
          payload
        );
      }

      setSuccess(true);
      setTimeout(() => {
        onSubmit();
        onClose();
      }, 1000);
    } catch (err) {
      console.error('Error saving policy holder:', err);
      setError(err.response?.data?.error || 'Failed to save policy holder. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white p-5">
          <h2 className="text-xl font-bold">
            {initialData ? 'Edit Policy Holder' : 'Add New Policy Holder'}
          </h2>
          <p className="text-indigo-200 text-sm">
            {initialData ? 'Update policy holder details' : 'Enter details for new policy holder'}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Policy holder {initialData ? 'updated' : 'created'} successfully!
            </div>
          )}
          
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="policyHolderName"
                value={formData.policyHolderName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="John Doe"
              />
            </div>
            
            {/* Contact Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="+1 (555) 123-4567"
              />
            </div>
            
            {/* Policy Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Policy Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="policyName"
                value={formData.policyName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Life Insurance Premium"
              />
            </div>
            
            {/* Amount and Payment Cycle */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount per Cycle ($) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                    $
                  </span>
                  <input
                    type="number"
                    name="amountPerCycle"
                    value={formData.amountPerCycle}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    required
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="150.00"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Cycle <span className="text-red-500">*</span>
                </label>
                <select
                  name="paymentCycle"
                  value={formData.paymentCycle}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Half-Yearly">Half-Yearly</option>
                  <option value="Yearly">Yearly</option>
                </select>
              </div>
            </div>
            
            {/* Status and Remarks */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                  <option value="Passed">Passed</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Lapsed">Lapsed</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Created Date
                </label>
                <input
                  type="text"
                  disabled
                  className="w-full px-4 py-2 bg-gray-100 rounded-lg cursor-not-allowed"
                  value={new Date().toLocaleDateString()}
                />
              </div>
            </div>
            
            {/* Remarks */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Remarks
              </label>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Additional notes about the policy holder..."
              ></textarea>
            </div>
          </div>
          
          {/* Form Actions */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-50 flex items-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {initialData ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {initialData ? 'Update Policy Holder' : 'Create Policy Holder'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PolicyHolderModal;