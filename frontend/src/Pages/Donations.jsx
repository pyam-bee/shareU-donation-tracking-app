import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DonationCard from '../Components/DonationCard';
import MetaMaskConnect from '../Components/MetaMaskConnect';
import { ethereumService } from '../services/ethereumService';

const Donations = () => {
  // Keep your existing state variables
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  
  // We don't need recipientAddress at the component level if we're showing multiple campaigns
  // Each campaign should have its own recipient address
  
  useEffect(() => {
    const fetchCampaigns = () => {
      try {
        setLoading(true);
        
        // Load from localStorage
        const campaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');
        
        // Filter to only show verified campaigns
        const verifiedCampaigns = campaigns.filter(campaign => campaign.verified);
        
        // Map to match your donation card format
        const formattedDonations = verifiedCampaigns.map(campaign => ({
          id: campaign.id,
          title: campaign.title,
          description: campaign.description,
          category: campaign.category,
          goalAmount: campaign.goalAmount,
          currentAmount: campaign.currentAmount || 0,
          donors: campaign.donors || 0,
          imageUrl: campaign.imageUrl || '/api/placeholder/400/300',
          endDate: campaign.endDate,
          ethWalletAddress: campaign.ethWalletAddress || '' // Include wallet address in each campaign
        }));
        
        setDonations(formattedDonations);
        setError(null);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
        setError("Failed to load campaigns. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchCampaigns();
  }, []);
  
  
  // Add new state for MetaMask connection
  const [connectedAccount, setConnectedAccount] = useState(null);
  const [metamaskError, setMetamaskError] = useState(null);

  const handleAccountChange = (account) => {
    setConnectedAccount(account);
    setMetamaskError(null);
  };

  const handleDonate = async (donationId, amount) => {
    if (!connectedAccount) {
      setMetamaskError('Please connect to MetaMask first');
      return;
    }
  
    try {
      setLoading(true);

      // Find the campaign to get its recipient address
      const campaign = donations.find(donation => donation.id === donationId);
      
      if (!campaign) {
        throw new Error('Campaign not found');
      }
      
      if (!campaign.ethWalletAddress) {
        throw new Error('Campaign has no associated wallet address');
      }
      
      // Pass the recipient address directly to the donate function
      const txHash = await ethereumService.donate(amount, campaign.ethWalletAddress);
      console.log('Donation successful:', txHash);
      
      // Update campaigns in localStorage
      const campaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');
      const campaignIndex = campaigns.findIndex(c => c.id === donationId);
      
      if (campaignIndex !== -1) {
        campaigns[campaignIndex].currentAmount = (parseFloat(campaigns[campaignIndex].currentAmount) || 0) + parseFloat(amount);
        campaigns[campaignIndex].donors = (parseInt(campaigns[campaignIndex].donors) || 0) + 1;
        localStorage.setItem('campaigns', JSON.stringify(campaigns));
      }
      
      // Update local state with new donation amount
      setDonations(prevDonations => 
        prevDonations.map(donation => 
          donation.id === donationId 
            ? { 
                ...donation, 
                currentAmount: parseFloat(donation.currentAmount) + parseFloat(amount),
                donors: donation.donors + 1
              } 
            : donation
        )
      );
      
      alert('Thank you for your donation!');
    } catch (error) {
      console.error('Donation failed', error);
      setMetamaskError('Donation failed: ' + (error.message || 'Please try again later'));
    } finally {
      setLoading(false);
    }
  };

  // Filter donations based on search term and category
  const filteredDonations = donations.filter(donation => {
    const matchesSearch = searchTerm === '' || 
      donation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === '' || 
      donation.category.toLowerCase() === categoryFilter.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });

  // Get unique categories for filter dropdown
  const categories = [...new Set(donations.map(donation => donation.category))];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Support a Cause</h1>
        <p className="text-lg text-gray-600 mb-6">
          Browse through our donation campaigns and contribute using Ethereum through MetaMask.
        </p>
        
        {/* MetaMask Connection */}
        <div className="mb-6">
          <MetaMaskConnect onAccountChange={handleAccountChange} />
          {metamaskError && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg mt-2">
              {metamaskError}
            </div>
          )}
        </div>
        
        {/* Search and filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search donations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <svg 
              className="absolute right-3 top-3 h-6 w-6 text-gray-400" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}
      
      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {/* Donations grid */}
      {!loading && filteredDonations.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDonations.map((donation) => (
            <DonationCard 
              key={donation.id}
              donation={donation}
              onDonate={handleDonate}
            />
          ))}
        </div>
      ) : !loading && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">No donations found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Donations;