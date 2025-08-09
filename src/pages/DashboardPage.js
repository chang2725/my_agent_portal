import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import HeroSectionModal from '../components/HeroSectionModal';
import BlogModal from '../components/BlogModal';
import LifeInsuranceModal from '../components/LifeInsuranceModal';
import TestimonialModal from '../components/TestimonialModal';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { agent, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('hero');
  const [heroSections, setHeroSections] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [lifeInsurances, setLifeInsurances] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [contactDetails, setContactDetails] = useState([]);
  const [showHeroModal, setShowHeroModal] = useState(false);
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [showLifeInsuranceModal, setShowLifeInsuranceModal] = useState(false);
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleMessageClick = (message) => {
    setSelectedMessage(message);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMessage('');
  };

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [heroRes, blogRes, insuranceRes, testimonialRes, contactRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/herosection/agent/${agent.id}`),
        axios.get(`${API_BASE_URL}/api/blog/agent/${agent.id}`),
        axios.get(`${API_BASE_URL}/api/lifeinsurance/agent/${agent.id}`),
        axios.get(`${API_BASE_URL}/api/testimonial/agent/${agent.id}`),
        axios.get(`${API_BASE_URL}/api/contactdetail/agent/${agent.id}`)
      ]);

      setHeroSections(heroRes.data.data || []);
      setBlogs(blogRes.data.data || []);
      setLifeInsurances(insuranceRes.data.data || []);
      setTestimonials(testimonialRes.data.data || []);
      setContactDetails(contactRes.data.data || []);
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

  const handleCreate = (type) => {
    setCurrentItem(null);
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
      default:
        break;
    }
  };

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
      default:
        break;
    }
  };

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

  const handleContactStatusUpdate = async (id, newStatus) => {
    try {
      await axios.put(`${API_BASE_URL}/api/contactdetail/${id}`);
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error updating contact status:', error);
      alert('Failed to update contact status');
    }
  };

  const handleModalSubmit = () => {
    setShowHeroModal(false);
    setShowBlogModal(false);
    setShowLifeInsuranceModal(false);
    setShowTestimonialModal(false);
    fetchData(); // Refresh data after any change
  };

  const getTabTitle = (tab) => {
    switch (tab) {
      case 'hero': return 'Hero Sections';
      case 'blog': return 'Blog Posts';
      case 'insurance': return 'Life Insurance';
      case 'testimonial': return 'Testimonials';
      case 'contact': return 'Contact Details';
      default: return '';
    }
  };

  const canCreateNew = (tab) => {
    return tab !== 'contact'; // Contact details are created by users, not agents
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Agent Dashboard</h1>
            <p className="text-indigo-200">Welcome back, {agent?.name || 'Agent'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-white text-indigo-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
          {['hero', 'blog', 'insurance', 'testimonial', 'contact'].map((tab) => (
            <button
              key={tab}
              className={`px-6 py-3 font-medium text-sm capitalize whitespace-nowrap ${activeTab === tab
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab(tab)}
            >
              {getTabTitle(tab)}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              {getTabTitle(activeTab)}
            </h2>
            {canCreateNew(activeTab) && (
              <button
                onClick={() => handleCreate(activeTab)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-indigo-700 transition"
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
            <div className="overflow-x-auto">
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
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{hero.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{hero.title}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{hero.subtitle}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs">
                              {hero.actionText}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleEdit(hero, 'hero')}
                              className="text-indigo-600 hover:text-indigo-900 mr-3"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(hero.id, 'hero')}
                              className="text-red-600 hover:text-red-900"
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
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{blog.id}</td>
                          <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{blog.title}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                              {blog.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(blog.published_date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleEdit(blog, 'blog')}
                              className="text-indigo-600 hover:text-indigo-900 mr-3"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(blog.id, 'blog')}
                              className="text-red-600 hover:text-red-900"
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
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{insurance.id}</td>
                          <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{insurance.Title }</td>
                          <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{insurance.Subtitle }</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{insurance.MinPremium }</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleEdit(insurance, 'insurance')}
                              className="text-indigo-600 hover:text-indigo-900 mr-3"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(insurance.id, 'insurance')}
                              className="text-red-600 hover:text-red-900"
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
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{testimonial.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{testimonial.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{testimonial.location}</td>
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
                              <span className="ml-1 text-xs">({testimonial.rating})</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                            {testimonial.testimonial_text || testimonial.testimonialText}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleDelete(testimonial.id, 'testimonial')}
                              className="text-red-600 hover:text-red-900"
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
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{contact.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contact.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {contact.phone_number || contact.phoneNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {contact.email_id || contact.emailId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                              {contact.service_required || contact.serviceRequired}
                            </span>
                          </td>
                          <td
                            onClick={() => handleMessageClick(contact.message_text || contact.messageText)}
                            className="px-6 py-4 text-sm text-blue-600 max-w-xs truncate cursor-pointer hover:underline"
                            title="Click to view full message"
                          >
                            {contact.message_text || contact.messageText}
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className={`px-2 py-1 rounded-full text-xs ${contact.status === 'Y' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                              {contact.status === 'Y' ? 'Active' : 'Completed'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {contact.status === 'Y' && (
                              <button
                                onClick={() => handleContactStatusUpdate(contact.id, 'N')}
                                className="text-orange-600 hover:text-orange-900 mr-3"
                              >
                                Mark Resolved
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(contact.id, 'contact')}
                              className="text-red-600 hover:text-red-900"
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

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 overflow-hidden">
            <h3 className="text-xl font-bold mb-4 text-center">📩 Full Message</h3>
            <div className="text-gray-700 whitespace-pre-wrap overflow-y-auto max-h-[70vh] px-1">
              {selectedMessage}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleCloseModal}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default DashboardPage;