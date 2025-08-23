import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import HeroSectionModal from '../components/HeroSectionModal';
import BlogModal from '../components/BlogModal';
import LifeInsuranceModal from '../components/LifeInsuranceModal';
import TestimonialModal from '../components/TestimonialModal';
import PolicyHolderModal from '../components/PolicyHolderModal'; // New modal

const DashboardPage = () => {
  const navigate = useNavigate();
  const { agent, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('hero');
  const [heroSections, setHeroSections] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [lifeInsurances, setLifeInsurances] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [contactDetails, setContactDetails] = useState([]);
  const [policyHolders, setPolicyHolders] = useState([]); // New state
  const [showHeroModal, setShowHeroModal] = useState(false);
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [showLifeInsuranceModal, setShowLifeInsuranceModal] = useState(false);
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);
  const [showPolicyHolderModal, setShowPolicyHolderModal] = useState(false); // New modal state
  const [currentItem, setCurrentItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedContent, setSelectedContent] = useState({ text: '', title: '' });
  const [showContentModal, setShowContentModal] = useState(false);

  // Configuration limits
  const LIMIT_HERO = parseInt(process.env.REACT_APP_LIMIT_PER_HERO_SECTION) || 10;
  const LIMIT_BLOG = parseInt(process.env.REACT_APP_LIMIT_PER_BLOG_SECTION) || 10;
  const LIMIT_TESTIMONIAL = parseInt(process.env.REACT_APP_LIMIT_PER_TESTIMONIAL_SECTION) || 10;
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

  // Handle content viewing (messages/remarks)
  const handleContentClick = (text, title) => {
    setSelectedContent({ text, title });
    setShowContentModal(true);
  };

  const handleCloseContentModal = () => {
    setShowContentModal(false);
    setSelectedContent({ text: '', title: '' });
  };

  // Fetch all data
  const fetchData = useCallback(async () => {
    if (!agent) return;

    try {
      setIsLoading(true);
      const [
        heroRes,
        blogRes,
        insuranceRes,
        testimonialRes,
        contactRes,
        policyHolderRes // New API call
      ] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/herosection/agent/${agent.id}`),
        axios.get(`${API_BASE_URL}/api/blog/agent/${agent.id}`),
        axios.get(`${API_BASE_URL}/api/lifeinsurance/agent/${agent.id}`),
        axios.get(`${API_BASE_URL}/api/testimonial/agent/${agent.id}`),
        axios.get(`${API_BASE_URL}/api/contactdetail/agent/${agent.id}`),
        axios.get(`${API_BASE_URL}/api/PolicyHolderDetail/agent/${agent.id}`) // New endpoint
      ]);

      setHeroSections(heroRes.data.data || []);
      setBlogs(blogRes.data.data || []);
      setLifeInsurances(insuranceRes.data.data || []);
      setTestimonials(testimonialRes.data.data || []);
      setContactDetails(contactRes.data.data || []);
      setPolicyHolders(policyHolderRes.data.data || []); // Set policy holders
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [agent, API_BASE_URL]);

  useEffect(() => {
    if (!agent) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [fetchData, agent, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Create new items
  const handleCreate = (type) => {
    setCurrentItem(null);
    switch (type) {
      case 'hero':
        if (heroSections.length < LIMIT_HERO) {
          setShowHeroModal(true);
        } else {
          alert(`You can only create up to ${LIMIT_HERO} hero sections.`);
        }
        break;
      case 'blog':
        if (blogs.length < LIMIT_BLOG) {
          setShowBlogModal(true);
        } else {
          alert(`You can only create up to ${LIMIT_BLOG} blog posts.`);
        }
        break;
      case 'insurance':
        setShowLifeInsuranceModal(true);
        break;
      case 'testimonial':
        if (testimonials.length < LIMIT_TESTIMONIAL) {
          setShowTestimonialModal(true);
        } else {
          alert(`You can only create up to ${LIMIT_TESTIMONIAL} testimonials.`);
        }
        break;
      case 'policyholder': // New case
        setShowPolicyHolderModal(true);
        break;
      default:
        break;
    }
  };

  // Edit existing items
  const handleEdit = (item, type) => {
    setCurrentItem(item);
    switch (type) {
      case 'hero':
        setShowHeroModal(true);
        break;
      case 'blog':
        setShowBlogModal(true);
        break;
      case 'insurance':
        setShowLifeInsuranceModal(true);
        break;
      case 'testimonial':
        setShowTestimonialModal(true);
        break;
      case 'policyholder': // New case
        setShowPolicyHolderModal(true);
        break;
      default:
        break;
    }
  };

  // Delete items
  const handleDelete = async (id, type) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      let endpoint = '';
      switch (type) {
        case 'hero':
          endpoint = `/api/herosection/${id}`;
          break;
        case 'blog':
          endpoint = `/api/blog/${id}`;
          break;
        case 'insurance':
          endpoint = `/api/lifeinsurance/${id}`;
          break;
        case 'testimonial':
          endpoint = `/api/testimonial/${id}`;
          break;
        case 'contact':
          endpoint = `/api/contactdetail/${id}`;
          break;
        case 'policyholder': // New case
          endpoint = `/api/PolicyHolderDetail/${id}`;
          break;
        default:
          return;
      }

      await axios.delete(`${API_BASE_URL}${endpoint}`);
      fetchData(); // Refresh data
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      alert(`Failed to delete ${type}`);
    }
  };

  // Update contact status
  const handleContactStatusUpdate = async (id, newStatus) => {
    try {
      await axios.put(`${API_BASE_URL}/api/contactdetail/${id}`, { status: newStatus });
      fetchData();
    } catch (error) {
      console.error('Error updating contact status:', error);
      alert('Failed to update contact status');
    }
  };

  // Update policy holder status
  const handlePolicyHolderStatusUpdate = async (id, newStatus) => {
    try {
      await axios.patch(`${API_BASE_URL}/api/PolicyHolderDetail/${id}/status`, { status: newStatus });
      fetchData();
    } catch (error) {
      console.error('Error updating policy holder status:', error);
      alert('Failed to update policy holder status');
    }
  };

  // Handle modal submission
  const handleModalSubmit = () => {
    setShowHeroModal(false);
    setShowBlogModal(false);
    setShowLifeInsuranceModal(false);
    setShowTestimonialModal(false);
    setShowPolicyHolderModal(false);
    fetchData();
  };

  // Get tab titles
  const getTabTitle = (tab) => {
    switch (tab) {
      case 'hero': return 'Hero Sections';
      case 'blog': return 'Blog Posts';
      case 'insurance': return 'Life Insurance';
      case 'testimonial': return 'Testimonials';
      case 'contact': return 'Contact Inquiries';
      case 'policyholder': return 'Policy Holders'; // New title
      default: return '';
    }
  };

  // Determine if create button should be shown
  const canCreateNew = (tab) => {
    return tab !== 'contact'; // Contact details are created by users
  };

  // Get status badge style
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-blue-100 text-blue-800';
      case 'Expired': return 'bg-red-100 text-red-800';
      case 'Y': return 'bg-green-100 text-green-800';
      case 'N': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <>

      <div className="min-h-[90vh] bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header */}
        <header className="bg-gradient-to-r from-indigo-700 to-purple-800 text-white shadow-xl">
          <div className="container mx-auto px-4 py-5 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="bg-white p-2 rounded-xl shadow">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-700" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold">Agent Dashboard</h1>
                <p className="text-indigo-200">Welcome back, {agent?.name || 'Agent'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-white text-indigo-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition flex items-center shadow-md hover:shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
              </svg>
              Logout
            </button>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="container mx-auto px-4 py-6">
          <div className="flex border-b border-gray-200 mb-6 overflow-x-auto bg-white rounded-xl shadow p-2 space-x-4">
            {['hero', 'blog', 'insurance', 'testimonial', 'contact', 'policyholder'].map((tab) => (
              <button
                key={tab}
                className={`relative px-6 py-3 font-medium text-sm capitalize whitespace-nowrap transition-all ${activeTab === tab
                  ? 'text-indigo-600 border-b-2 border-indigo-600 font-semibold'
                  : 'text-gray-500 hover:text-gray-700'
                  }`}
                onClick={() => setActiveTab(tab)}
              >
                {getTabTitle(tab)}

                {/* Notification badge */}
                {tab === 'contact' && contactDetails.length > 0 && (
                  <span
                    className="absolute -top-1 -right-1 bg-gradient-to-br from-red-500 to-red-600
          text-white text-[10px] font-bold rounded-full h-5 w-5
          flex items-center justify-center shadow-md"
                  >
                    {contactDetails.filter(c => c.status === 'Y').length}
                  </span>
                )}
              </button>
            ))}
          </div>


          {/* Content Area */}
          <div className="bg-white rounded-xl shadow-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                {getTabTitle(activeTab)}
                {activeTab === 'policyholder' && policyHolders.length > 0 && (
                  <span className="ml-3 bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {policyHolders.length} policies
                  </span>
                )}
              </h2>
              {canCreateNew(activeTab) && (
                <button
                  onClick={() => handleCreate(activeTab)}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg flex items-center hover:from-indigo-700 hover:to-purple-700 transition shadow-md hover:shadow-lg"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Create New
                </button>
              )}
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                {/* Hero Sections Table */}
                {activeTab === 'hero' && (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtitle</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {heroSections.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                            No hero sections found. Create your first one!
                          </td>
                        </tr>
                      ) : (
                        heroSections.map((hero) => (
                          <tr key={hero.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{hero.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">{hero.title}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 max-w-xs truncate">{hero.subtitle}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs">
                                {hero.actionText}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                              <button
                                onClick={() => handleEdit(hero, 'hero')}
                                className="text-indigo-600 hover:text-indigo-900 px-2 py-1 rounded hover:bg-indigo-50"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(hero.id, 'hero')}
                                className="text-red-600 hover:text-red-900 px-2 py-1 rounded hover:bg-red-50"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                )}

                {/* Blog Posts Table */}
                {activeTab === 'blog' && (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sorting order</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Published Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {blogs.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                            No blog posts found. Create your first one!
                          </td>
                        </tr>
                      ) : (
                        blogs.map((blog) => (
                          <tr key={blog.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{blog.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{blog.sortingOrder}</td>
                            <td className="px-6 py-4 text-sm font-semibold text-gray-800 max-w-xs truncate">{blog.title}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                {blog.category}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(blog.publishedDate).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                              <button
                                onClick={() => handleEdit(blog, 'blog')}
                                className="text-indigo-600 hover:text-indigo-900 px-2 py-1 rounded hover:bg-indigo-50"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(blog.id, 'blog')}
                                className="text-red-600 hover:text-red-900 px-2 py-1 rounded hover:bg-red-50"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                )}

                {/* Life Insurance Table */}
                {activeTab === 'insurance' && (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtitle</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min Premium</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {lifeInsurances.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                            No insurance products found. Create your first one!
                          </td>
                        </tr>
                      ) : (
                        lifeInsurances.map((insurance) => (
                          <tr key={insurance.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{insurance.id}</td>
                            <td className="px-6 py-4 text-sm font-semibold text-gray-800 max-w-xs truncate">{insurance.Title}</td>
                            <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{insurance.Subtitle}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-indigo-700">
                              {insurance.MinPremium}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                              <button
                                onClick={() => handleEdit(insurance, 'insurance')}
                                className="text-indigo-600 hover:text-indigo-900 px-2 py-1 rounded hover:bg-indigo-50"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(insurance.id, 'insurance')}
                                className="text-red-600 hover:text-red-900 px-2 py-1 rounded hover:bg-red-50"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                )}

                {/* Testimonials Table */}
                {activeTab === 'testimonial' && (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Testimonial</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {testimonials.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                            No testimonials found. Create your first one!
                          </td>
                        </tr>
                      ) : (
                        testimonials.map((testimonial) => (
                          <tr key={testimonial.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{testimonial.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">{testimonial.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{testimonial.location}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <svg
                                    key={i}
                                    className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                                <span className="ml-1 text-xs font-medium">({testimonial.rating})</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                              {testimonial.testimonial_text || testimonial.testimonialText}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => handleDelete(testimonial.id, 'testimonial')}
                                className="text-red-600 hover:text-red-900 px-2 py-1 rounded hover:bg-red-50"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                )}

                {/* Contact Details Table */}
                {activeTab === 'contact' && (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Required</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {contactDetails.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                            No contact inquiries found.
                          </td>
                        </tr>
                      ) : (
                        contactDetails.map((contact) => (
                          <tr key={contact.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{contact.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">{contact.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {contact.phone_number || contact.phoneNumber}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                              {contact.email_id || contact.emailId}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                {contact.service_required || contact.serviceRequired}
                              </span>
                            </td>
                            <td
                              onClick={() => handleContentClick(contact.message_text || contact.messageText, 'Full Message')}
                              className="px-6 py-4 text-sm text-indigo-600 max-w-xs truncate cursor-pointer hover:underline"
                              title="Click to view full message"
                            >
                              {contact.message_text || contact.messageText}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(contact.status)}`}>
                                {contact.status === 'Y' ? 'New' : 'Resolved'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                              {contact.status === 'Y' ? (
                                <button
                                  onClick={() => handleContactStatusUpdate(contact.id, 'N')}
                                  className="text-green-600 hover:text-green-800 px-2 py-1 rounded hover:bg-green-50"
                                >
                                  Resolve
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleContactStatusUpdate(contact.id, 'Y')}
                                  className="text-gray-600 hover:text-gray-800 px-2 py-1 rounded hover:bg-gray-100"
                                  disabled="true"
                                >
                                  Resolve
                                </button>
                              )}
                              <button
                                onClick={() => handleDelete(contact.id, 'contact')}
                                className="text-red-600 hover:text-red-800 px-2 py-1 rounded hover:bg-red-50"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                )}

                {/* Policy Holders Table */}
                {activeTab === 'policyholder' && (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Policy</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cycle</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {policyHolders.length === 0 ? (
                        <tr>
                          <td colSpan="10" className="px-6 py-4 text-center text-gray-500">
                            No policy holders found.
                          </td>
                        </tr>
                      ) : (
                        policyHolders.map((holder) => (
                          <tr key={holder.PolicyHolderId} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              #{holder.PolicyHolderId}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">
                              {holder.PolicyHolderName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {holder.ContactNumber}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-indigo-700">
                              {holder.PolicyName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                              {formatCurrency(holder.AmountPerCycle)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {holder.PaymentCycle}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(holder.status)}`}>
                                {holder.Status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(holder.CreatedDate).toLocaleDateString()}
                            </td>
                            <td
                              onClick={() => handleContentClick(holder.Remarks, 'Policy Holder Remarks')}
                              className="px-6 py-4 text-sm text-indigo-600 max-w-xs truncate cursor-pointer hover:underline"
                              title="Click to view remarks"
                            >
                              {holder.Remarks || 'View remarks'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                              <button
                                onClick={() => handleEdit(holder, 'policyholder')}
                                className="text-indigo-600 hover:text-indigo-900 px-2 py-1 rounded hover:bg-indigo-50"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handlePolicyHolderStatusUpdate(holder.policyHolderId, holder.status === 'Active' ? 'Expired' : 'Active')}
                                className="text-yellow-600 hover:text-yellow-900 px-2 py-1 rounded hover:bg-yellow-50"
                              >
                                {holder.status === 'Active' ? 'Expire' : 'Activate'}
                              </button>
                              <button
                                onClick={() => handleDelete(holder.policyHolderId, 'policyholder')}
                                className="text-red-600 hover:text-red-900 px-2 py-1 rounded hover:bg-red-50"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Modals */}
        {showHeroModal && (
          <HeroSectionModal
            agentId={agent.id}
            initialData={currentItem}
            onClose={() => setShowHeroModal(false)}
            onSubmit={handleModalSubmit}
          />
        )}

        {showBlogModal && (
          <BlogModal
            agentId={agent.id}
            initialData={currentItem}
            onClose={() => setShowBlogModal(false)}
            onSubmit={handleModalSubmit}
          />
        )}

        {showLifeInsuranceModal && (
          <LifeInsuranceModal
            agentId={agent.id}
            initialData={currentItem}
            onClose={() => setShowLifeInsuranceModal(false)}
            onSubmit={handleModalSubmit}
          />
        )}

        {showTestimonialModal && (
          <TestimonialModal
            agentId={agent.id}
            initialData={currentItem}
            onClose={() => setShowTestimonialModal(false)}
            onSubmit={handleModalSubmit}
          />
        )}

        {showPolicyHolderModal && (
          <PolicyHolderModal
            agentId={agent.id}
            initialData={currentItem}
            onClose={() => setShowPolicyHolderModal(false)}
            onSubmit={handleModalSubmit}
          />
        )}

        {/* Content View Modal */}
        {showContentModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 max-h-[90vh] flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  {selectedContent.title}
                </h3>
                <button
                  onClick={handleCloseContentModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="text-gray-700 whitespace-pre-wrap overflow-y-auto flex-grow px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                {selectedContent.text || <span className="text-gray-400 italic">No content available</span>}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleCloseContentModal}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <footer className="bg-gray-900 text-gray-300 py-6 bottom-0 w-full">
        <div className="container mx-auto px-4">
          {/* Divider Line */}
          <div className="border-t border-gray-700 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2">

            {/* Company Info */}
            <div className="text-sm text-center sm:text-left">
              © {new Date().getFullYear()}{" "}
              <span className="font-semibold text-white">Chang Group of IT Solutions</span>.
              Designed, Developed & Maintained with ❤️.
            </div>

            {/* Footer Links */}
            <div className="flex space-x-4">
              <a href="/privacy" className="text-sm hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="text-sm hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="/contact" className="text-sm hover:text-white transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>


    </>
  );
};

export default DashboardPage;