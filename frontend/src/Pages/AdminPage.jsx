import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';

// ==========================================================
// IMPROVED ADMIN NAVBAR COMPONENT
// ==========================================================
const AdminNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  const navItems = [
    { 
      name: 'Dashboard', 
      path: '/admin', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    { 
      name: 'Campaign Review', 
      path: '/admin/campaigns', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      )
    },
    { 
      name: 'User Management', 
      path: '/admin/users', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    { 
      name: 'Analytics', 
      path: '/admin/analytics', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    { 
      name: 'Settings', 
      path: '/admin/settings', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    }
  ];

  return (
    <>
      {/* Desktop Sidebar Nav - hidden on mobile */}
      <div className="fixed inset-y-0 left-0 w-64 bg-gray-800 overflow-y-auto hidden md:block">
        <div className="px-4 py-6">
          <h2 className="text-2xl font-bold text-white mb-6">Admin Panel</h2>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link 
                key={item.path}
                to={item.path} 
                className={`group flex items-center px-4 py-3 text-base font-medium rounded-md ${
                  isActive(item.path) 
                    ? 'bg-gray-900 text-white' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
            
            <div className="border-t border-gray-700 my-4"></div>
            
            <Link 
              to="/" 
              className="group flex items-center px-4 py-3 text-base font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Site
            </Link>
          </nav>
        </div>
      </div>

      {/* Mobile Top Navbar */}
      <div className="md:hidden bg-gray-800 text-white">
        <div className="px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          >
            {isMobileMenuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-800 text-white">
          <nav className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`${
                  isActive(item.path)
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                } block px-3 py-2 rounded-md text-base font-medium flex items-center`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
            <div className="border-t border-gray-700 my-2"></div>
            <Link
              to="/"
              className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium flex items-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Site
            </Link>
          </nav>
        </div>
      )}
    </>
  );
};

// Main Admin Layout Component
const AdminLayout = ({ children }) => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <AdminNavbar />
      <div className="md:pl-64">
        <main className="py-6">
          {children}
        </main>
      </div>
    </div>
  );
};

// Page Title Component for Mobile
const PageTitle = ({ title }) => {
  return (
    <div className="bg-white shadow md:hidden">
      <div className="px-4 py-4">
        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
      </div>
    </div>
  );
};

// -------------------------------------------------------
// DASHBOARD COMPONENT
// -------------------------------------------------------
const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    pendingCampaigns: 0,
    activeCampaigns: 0,
    totalRaised: 0,
    totalUsers: 120 // Placeholder
  });
  
  const [recentCampaigns, setRecentCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = () => {
      try {
        const campaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');
        
        // Calculate stats
        const pendingCampaigns = campaigns.filter(c => !c.verified);
        const activeCampaigns = campaigns.filter(c => c.verified);
        const totalRaised = activeCampaigns.reduce((sum, campaign) => sum + (parseFloat(campaign.currentAmount) || 0), 0);
        
        setStats({
          totalCampaigns: campaigns.length,
          pendingCampaigns: pendingCampaigns.length,
          activeCampaigns: activeCampaigns.length,
          totalRaised: totalRaised,
          totalUsers: 120 // Placeholder
        });
        
        // Get recent campaigns (sort by most recent)
        const sortedCampaigns = [...campaigns].sort((a, b) => 
          new Date(b.endDate) - new Date(a.endDate)
        ).slice(0, 5);
        
        setRecentCampaigns(sortedCampaigns);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const formatDate = (dateString) => {
    const date = dateString ? new Date(dateString) : new Date();
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const StatCard = ({ title, value, icon, color }) => (
    <div className={`bg-white shadow-md rounded-lg overflow-hidden border-l-4 ${color}`}>
      <div className="p-5 flex items-center">
        <div className={`rounded-full p-3 ${color.replace('border-', 'bg-').replace('-600', '-100')} ${color.replace('border-', 'text-')}`}>
          {icon}
        </div>
        <div className="ml-4">
          <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <PageTitle title="Admin Dashboard" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Dashboard
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Overview of your crowdfunding platform
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <Link
              to="/admin/campaigns"
              className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Review Campaigns
            </Link>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard 
                title="Total Campaigns" 
                value={stats.totalCampaigns}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                }
                color="border-blue-600"
              />
              <StatCard 
                title="Pending Review" 
                value={stats.pendingCampaigns}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                color="border-yellow-600"
              />
              <StatCard 
                title="Active Campaigns" 
                value={stats.activeCampaigns}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                color="border-green-600"
              />
              <StatCard 
                title="Total Funds Raised" 
                value={`$${stats.totalRaised.toLocaleString()}`}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                color="border-purple-600"
              />
            </div>
          
            {/* Recent campaigns */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">Recent Campaign Applications</h2>
                <Link to="/admin/campaigns" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                  View all
                </Link>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Campaign
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Creator
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Goal
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        End Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentCampaigns.length > 0 ? (
                      recentCampaigns.map((campaign) => (
                        <tr key={campaign.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{campaign.title}</div>
                            <div className="text-sm text-gray-500">{campaign.category}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{campaign.creatorName}</div>
                            <div className="text-sm text-gray-500">{campaign.creatorEmail}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">${parseFloat(campaign.goalAmount).toLocaleString()}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{formatDate(campaign.endDate)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              campaign.verified 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {campaign.verified ? 'Approved' : 'Pending'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link 
                              to={`/admin/campaigns?id=${campaign.id}`} 
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Review
                            </Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                          No campaigns found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          
            {/* Quick actions */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
              </div>
              <div className="border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                  <Link to="/admin/campaigns?filter=pending" className="group flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                    <div className="flex-shrink-0 bg-blue-100 rounded-md p-3 group-hover:bg-blue-200">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-base font-medium text-gray-900">Review Pending Applications</p>
                      <p className="mt-1 text-sm text-gray-500">{stats.pendingCampaigns} campaigns waiting for review</p>
                    </div>
                  </Link>
                  
                  <Link to="/admin/analytics" className="group flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                    <div className="flex-shrink-0 bg-green-100 rounded-md p-3 group-hover:bg-green-200">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-base font-medium text-gray-900">View Analytics</p>
                      <p className="mt-1 text-sm text-gray-500">Campaign performance metrics</p>
                    </div>
                  </Link>
                  
                  <Link to="/admin/settings" className="group flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                    <div className="flex-shrink-0 bg-purple-100 rounded-md p-3 group-hover:bg-purple-200">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-base font-medium text-gray-900">Platform Settings</p>
                      <p className="mt-1 text-sm text-gray-500">Configure system preferences</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

// -------------------------------------------------------
// CAMPAIGN REVIEW COMPONENT - FIXED VERSION
// -------------------------------------------------------
const CampaignReview = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'approved'
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get campaign ID from URL query params
  useEffect(() => {
    const fetchCampaigns = () => {
      try {
        const savedCampaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');
        setCampaigns(savedCampaigns);
        
        // Check if campaign ID is in URL
        const params = new URLSearchParams(location.search);
        const campaignId = params.get('id');
        const filterParam = params.get('filter');
        
        if (filterParam) {
          setFilter(filterParam);
        }
        
        if (campaignId) {
          const selectedCampaign = savedCampaigns.find(c => c.id === campaignId);
          if (selectedCampaign) {
            setCampaign(selectedCampaign);
          }
        }
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCampaigns();
  }, [location]);
  
  const handleApprove = (id) => {
    const updatedCampaigns = campaigns.map(c => 
      c.id === id ? { ...c, verified: true } : c
    );
    
    localStorage.setItem('campaigns', JSON.stringify(updatedCampaigns));
    setCampaigns(updatedCampaigns);
    
    if (campaign && campaign.id === id) {
      setCampaign({ ...campaign, verified: true });
    }
    
    alert('Campaign approved successfully!');
  };
  
  const handleReject = (id) => {
    if (window.confirm('Are you sure you want to reject this campaign? This action cannot be undone.')) {
      const updatedCampaigns = campaigns.filter(c => c.id !== id);
      
      localStorage.setItem('campaigns', JSON.stringify(updatedCampaigns));
      setCampaigns(updatedCampaigns);
      
      if (campaign && campaign.id === id) {
        setCampaign(null);
        navigate('/admin/campaigns');
      }
      
      alert('Campaign rejected successfully!');
    }
  };
  
  const handleBackToList = () => {
    setCampaign(null);
    navigate('/admin/campaigns');
  };
  
  const formatDate = (dateString) => {
    const date = dateString ? new Date(dateString) : new Date();
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  const filteredCampaigns = campaigns.filter(c => {
    if (filter === 'pending') return !c.verified;
    if (filter === 'approved') return c.verified;
    return true; // 'all'
  });

  return (
    <>
      <PageTitle title="Campaign Review" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!campaign ? (
          <>
            {/* Campaign List View */}
            <div className="md:flex md:items-center md:justify-between mb-8">
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                  Campaign Review
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Review and manage campaign submissions
                </p>
              </div>
            </div>
            
            {/* Filter Tabs */}
            <div className="border-b border-gray-200 mb-8">
              <nav className="-mb-px flex">
                <button
                  onClick={() => {
                    setFilter('all');
                    navigate('/admin/campaigns');
                  }}
                  className={`${
                    filter === 'all'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm mr-8`}
                >
                  All Campaigns
                </button>
                <button
                  onClick={() => {
                    setFilter('pending');
                    navigate('/admin/campaigns?filter=pending');
                  }}
                  className={`${
                    filter === 'pending'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm mr-8`}
                >
                  Pending Review
                </button>
                <button
                  onClick={() => {
                    setFilter('approved');
                    navigate('/admin/campaigns?filter=approved');
                  }}
                  className={`${
                    filter === 'approved'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Approved
                </button>
              </nav>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                {filteredCampaigns.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {filteredCampaigns.map((campaign) => (
                      <li key={campaign.id}>
                        <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-12 w-12 bg-gray-200 rounded-md overflow-hidden">
                                {campaign.imageUrl ? (
                                  <img 
                                    src={campaign.imageUrl} 
                                    alt={campaign.title}
                                    className="h-12 w-12 object-cover"
                                  />
                                ) : (
                                  <div className="h-12 w-12 flex items-center justify-center text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-blue-600 hover:text-blue-700 cursor-pointer" onClick={() => {
                                  setCampaign(campaign);
                                  navigate(`/admin/campaigns?id=${campaign.id}`);
                                }}>
                                  {campaign.title}
                                </div>
                                <div className="text-sm text-gray-500">
                                  by {campaign.creatorName} • {campaign.category}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                campaign.verified 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              } mr-4`}>
                                {campaign.verified ? 'Approved' : 'Pending'}
                              </span>
                              <span className="text-sm text-gray-500">
                                Goal: ${parseFloat(campaign.goalAmount).toLocaleString()}
                              </span>
                              <button
                                onClick={() => {
                                  setCampaign(campaign);
                                  navigate(`/admin/campaigns?id=${campaign.id}`);
                                }}
                                className="ml-6 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                Review
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-12">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No campaigns found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {filter === 'pending' 
                        ? 'There are no pending campaigns to review.' 
                        : filter === 'approved'
                          ? 'There are no approved campaigns.'
                          : 'There are no campaigns available.'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <>
            {/* Campaign Detail View */}
            <div className="mb-6">
              <button
                onClick={handleBackToList}
                className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to list
              </button>
            </div>
            
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Campaign Details
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Review the campaign information below.
                  </p>
                </div>
                <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                  campaign.verified 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {campaign.verified ? 'Approved' : 'Pending Review'}
                </span>
              </div>
              
              <div className="border-b border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 md:divide-x md:divide-gray-200">
                  <div className="px-4 py-5 sm:px-6">
                    <div className="text-sm font-medium text-gray-500">Campaign Title</div>
                    <div className="mt-1 text-lg text-gray-900">{campaign.title}</div>
                  </div>
                  <div className="px-4 py-5 sm:px-6">
                    <div className="text-sm font-medium text-gray-500">Creator</div>
                    <div className="mt-1 text-lg text-gray-900">{campaign.creatorName}</div>
                  </div>
                  <div className="px-4 py-5 sm:px-6">
                    <div className="text-sm font-medium text-gray-500">Category</div>
                    <div className="mt-1 text-lg text-gray-900">{campaign.category}</div>
                  </div>
                </div>
              </div>
              
              <div className="border-b border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 md:divide-x md:divide-gray-200">
                  <div className="px-4 py-5 sm:px-6">
                    <div className="text-sm font-medium text-gray-500">Goal Amount</div>
                    <div className="mt-1 text-lg text-gray-900">${parseFloat(campaign.goalAmount).toLocaleString()}</div>
                  </div>
                  <div className="px-4 py-5 sm:px-6">
                    <div className="text-sm font-medium text-gray-500">Current Amount Raised</div>
                    <div className="mt-1 text-lg text-gray-900">${parseFloat(campaign.currentAmount || 0).toLocaleString()}</div>
                  </div>
                  <div className="px-4 py-5 sm:px-6">
                    <div className="text-sm font-medium text-gray-500">End Date</div>
                    <div className="mt-1 text-lg text-gray-900">{formatDate(campaign.endDate)}</div>
                  </div>
                </div>
              </div>
              
              <div className="px-4 py-5 sm:px-6">
                <div className="text-sm font-medium text-gray-500">Campaign Description</div>
                <div className="mt-2 prose max-w-none text-gray-900">
                  {campaign.description}
                </div>
              </div>
              
              {campaign.imageUrl && (
                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                  <div className="text-sm font-medium text-gray-500 mb-2">Campaign Image</div>
                  <div className="max-w-lg">
                    <img 
                      src={campaign.imageUrl} 
                      alt={campaign.title}
                      className="rounded-lg shadow-md"
                    />
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Campaign Review Actions
                </h3>
                <div className="mt-5 flex space-x-4">
                  {!campaign.verified && (
                    <button
                      onClick={() => handleApprove(campaign.id)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Approve Campaign
                    </button>
                  )}
                  <button
                    onClick={() => handleReject(campaign.id)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    {campaign.verified ? 'Remove Campaign' : 'Reject Campaign'}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

// -------------------------------------------------------
// USER MANAGEMENT COMPONENT
// -------------------------------------------------------
const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Mock data - in a real app, this would come from an API
    setTimeout(() => {
      const mockUsers = [
        { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin', campaigns: 3, status: 'active' },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'User', campaigns: 5, status: 'active' },
        { id: '3', name: 'Robert Johnson', email: 'robert@example.com', role: 'User', campaigns: 2, status: 'active' },
        { id: '4', name: 'Sarah Williams', email: 'sarah@example.com', role: 'User', campaigns: 1, status: 'active' },
        { id: '5', name: 'Michael Brown', email: 'michael@example.com', role: 'Moderator', campaigns: 0, status: 'inactive' },
      ];
      setUsers(mockUsers);
      setLoading(false);
    }, 800);
  }, []);

  return (
    <>
      <PageTitle title="User Management" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              User Management
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              View and manage platform users
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              type="button"
              className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add User
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Campaigns
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                            {user.name.charAt(0)}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === 'Admin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : user.role === 'Moderator'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.campaigns}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-4">
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        Disable
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

const AdminPage = { AdminLayout, AdminDashboard, CampaignReview, UserManagement };
export default AdminPage;