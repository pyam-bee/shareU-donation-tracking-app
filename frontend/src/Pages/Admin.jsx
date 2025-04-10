import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AdminCampaignReview = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fetch campaigns from localStorage on component mount
  useEffect(() => {
    const fetchCampaigns = () => {
      try {
        const storedCampaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');
        setCampaigns(storedCampaigns);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCampaigns();
  }, []);

  // Filter campaigns based on verification status and search term
  const filteredCampaigns = campaigns.filter(campaign => {
    const statusMatch = statusFilter === 'all' || 
      (statusFilter === 'pending' && !campaign.verified) || 
      (statusFilter === 'approved' && campaign.verified);
    
    const searchMatch = searchTerm === '' || 
      campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.creatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.creatorEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    return statusMatch && searchMatch;
  });

  // Handle campaign approval
  const handleApprove = (campaignId) => {
    const updatedCampaigns = campaigns.map(campaign => 
      campaign.id === campaignId ? { ...campaign, verified: true } : campaign
    );
    
    localStorage.setItem('campaigns', JSON.stringify(updatedCampaigns));
    setCampaigns(updatedCampaigns);
    setSelectedCampaign(null);
    
    alert('Campaign approved successfully!');
  };

  // Handle campaign rejection
  const handleDecline = (campaignId) => {
    if (window.confirm('Are you sure you want to decline this campaign?')) {
      const updatedCampaigns = campaigns.filter(campaign => campaign.id !== campaignId);
      
      localStorage.setItem('campaigns', JSON.stringify(updatedCampaigns));
      setCampaigns(updatedCampaigns);
      setSelectedCampaign(null);
      
      alert('Campaign declined successfully!');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // PDF Modal component
  const PdfModal = ({ campaign, onClose }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 h-5/6 flex flex-col">
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="text-lg font-semibold">Application PDF</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-grow p-4">
            {campaign.pdfApplication ? (
              <iframe 
                src={`https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(campaign.pdfApplication)}`}
                className="w-full h-full border border-gray-300 rounded"
                title="Campaign Application PDF"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">No PDF available for this campaign.</p>
              </div>
            )}
          </div>
          <div className="p-4 border-t flex justify-end space-x-3">
            <button 
              onClick={onClose} 
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Campaign details panel
  const CampaignDetails = ({ campaign }) => {
    return (
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="flex justify-between items-center p-4 bg-blue-50">
          <h3 className="text-xl font-bold text-blue-800">{campaign.title}</h3>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            campaign.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            {campaign.verified ? 'Approved' : 'Pending Review'}
          </span>
        </div>
        
        <div className="p-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Creator</p>
              <p className="text-gray-800">{campaign.creatorName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Contact</p>
              <p className="text-gray-800">{campaign.creatorEmail}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Category</p>
              <p className="text-gray-800 capitalize">{campaign.category}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Goal Amount</p>
              <p className="text-gray-800">${campaign.goalAmount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Duration</p>
              <p className="text-gray-800">{campaign.duration} days</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">End Date</p>
              <p className="text-gray-800">{formatDate(campaign.endDate)}</p>
            </div>
          </div>
          
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-500">Description</p>
            <p className="text-gray-800 mt-1 whitespace-pre-line">{campaign.description}</p>
          </div>
          
          <div className="mt-4">
            <button
              onClick={() => setShowPdfModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
              </svg>
              View Application PDF
            </button>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => handleDecline(campaign.id)}
              className="px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-50"
            >
              Decline
            </button>
            {!campaign.verified && (
              <button
                onClick={() => handleApprove(campaign.id)}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Approve
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Campaign Applications</h1>
          <p className="mt-1 text-gray-600">Review and manage campaign applications</p>
        </div>
        <Link to="/dashboard" className="mt-4 md:mt-0 flex items-center text-blue-600 hover:text-blue-800">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Back to Dashboard
        </Link>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
              <svg 
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="pending">Pending Review</option>
              <option value="approved">Approved</option>
              <option value="all">All Campaigns</option>
            </select>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Campaign list */}
          <div className={`w-full ${selectedCampaign ? 'lg:w-1/3' : ''}`}>
            {filteredCampaigns.length > 0 ? (
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-4 bg-gray-50 border-b border-gray-200">
                  <h2 className="font-medium text-gray-700">
                    {filteredCampaigns.length} {filteredCampaigns.length === 1 ? 'Campaign' : 'Campaigns'}
                  </h2>
                </div>
                <div className="divide-y divide-gray-200 max-h-[calc(100vh-300px)] overflow-y-auto">
                  {filteredCampaigns.map((campaign) => (
                    <div 
                      key={campaign.id}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedCampaign?.id === campaign.id ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedCampaign(campaign)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{campaign.title}</h3>
                          <p className="text-sm text-gray-500">by {campaign.creatorName}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          campaign.verified 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {campaign.verified ? 'Approved' : 'Pending'}
                        </span>
                      </div>
                      <div className="mt-2 flex justify-between text-sm">
                        <span className="text-gray-500">${campaign.goalAmount.toLocaleString()}</span>
                        <span className="text-gray-500">{formatDate(campaign.endDate)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white shadow-md rounded-lg p-8 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No campaigns found</h3>
                <p className="mt-1 text-gray-500">
                  {statusFilter === 'pending' ? 'No pending campaigns to review.' : 
                   statusFilter === 'approved' ? 'No approved campaigns yet.' : 
                   'No campaigns match your search criteria.'}
                </p>
              </div>
            )}
          </div>
          
          {/* Campaign details */}
          {selectedCampaign && (
            <div className="w-full lg:w-2/3">
              <CampaignDetails campaign={selectedCampaign} />
            </div>
          )}
        </div>
      )}
      
      {/* PDF Modal */}
      {showPdfModal && selectedCampaign && (
        <PdfModal 
          campaign={selectedCampaign} 
          onClose={() => setShowPdfModal(false)} 
        />
      )}
    </div>
  );
};

export default AdminCampaignReview;