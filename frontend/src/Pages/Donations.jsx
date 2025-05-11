import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import DonationCard from '../Components/DonationCard';
import MetaMaskConnect from '../Components/MetaMaskConnect';
import { ethereumService } from '../services/ethereumService';
import { contractService } from '../services/contractService';
import { ethers } from 'ethers';

const Donations = () => {
  // Keep your existing state variables
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  
  // Add new state for contract campaigns
  const [contractCampaigns, setContractCampaigns] = useState([]);
  const [connectedAccount, setConnectedAccount] = useState(null);
  const [metamaskError, setMetamaskError] = useState(null);
  const [networkName, setNetworkName] = useState('');
  
  // Use a ref to track if we should refresh blockchain data
  const shouldRefreshBlockchain = useRef(false);
  
  // Add a state for transaction status
  const [txStatus, setTxStatus] = useState(null);

  // Fetch local campaigns
  useEffect(() => {
    const fetchLocalCampaigns = async () => {
      try {
        setLoading(true);
        
        // Load from localStorage (your current approach)
        const campaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');
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
          ethWalletAddress: campaign.ethWalletAddress || '',
          isBlockchain: false // Flag to identify non-blockchain campaigns
        }));
        
        setDonations(formattedDonations);
        setError(null);
      } catch (error) {
        console.error("Error fetching local campaigns:", error);
        setError("Failed to load campaigns. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchLocalCampaigns();
  }, []); // Only run on component mount
  
  // Separate useEffect for blockchain campaigns
  useEffect(() => {
    // Skip if no connected account or already loading
    if (!connectedAccount || loading) {
      return;
    }
    
    const fetchBlockchainCampaigns = async () => {
      // Check if we should fetch blockchain campaigns 
      if (!shouldRefreshBlockchain.current) {
        return;
      }
      
      try {
        setLoading(true);
        console.log("Fetching blockchain campaigns...");
        
        // Check if contract is initialized
        if (!contractService.isInitialized()) {
          console.log("Contract service not initialized, initializing now...");
          await contractService.initializeContract();
        }
        
        const campaigns = await contractService.getAllCampaigns();
        console.log("Blockchain campaigns:", campaigns);
        
        // Filter only approved campaigns
        const approvedCampaigns = campaigns.filter(campaign => campaign.isApproved && !campaign.isClosed);
        setContractCampaigns(approvedCampaigns);
        
        // Process blockchain campaigns 
        const blockchainDonations = approvedCampaigns.map(campaign => {
          // Calculate remaining time
          const deadlineDate = new Date(campaign.deadline.toNumber() * 1000);
          
          return {
            id: `blockchain-${campaign.id.toString()}`,  // Ensure unique IDs
            title: campaign.title,
            description: campaign.description,
            category: "Blockchain", // Default category for blockchain campaigns
            goalAmount: parseFloat(ethers.utils.formatEther(campaign.fundingGoal)),
            currentAmount: parseFloat(ethers.utils.formatEther(campaign.amountRaised)),
            donors: 0, // This information isn't provided in the contract
            imageUrl: '/api/placeholder/400/300',
            endDate: deadlineDate.toISOString(),
            ethWalletAddress: campaign.owner,
            isBlockchain: true,
            blockchainId: campaign.id.toNumber() // Store the numeric blockchain ID
          };
        });
        
        // Set donations by combining local and blockchain (without referencing existing state)
        setDonations(currentDonations => {
          // Filter out any existing blockchain donations
          const localDonations = currentDonations.filter(d => !d.isBlockchain);
          return [...localDonations, ...blockchainDonations];
        });
        
        // Reset the refresh flag
        shouldRefreshBlockchain.current = false;
      } catch (error) {
        console.error("Error fetching blockchain campaigns:", error);
        // Don't set the error state here to avoid disrupting the UI
        // if blockchain fetch fails but local data is available
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlockchainCampaigns();
  }, [connectedAccount, loading]); // Only depend on connectedAccount and loading
  
  // Effect to trigger blockchain fetch when account connects
  useEffect(() => {
    if (connectedAccount) {
      shouldRefreshBlockchain.current = true;
    }
  }, [connectedAccount]);
  
  const handleAccountChange = async (account) => {
    setConnectedAccount(account);
    setMetamaskError(null);
    
    if (account) {
      try {
        // Get network information
        const network = await ethereumService.getNetworkName();
        setNetworkName(network);
        
        // Initialize contract when account connects
        await contractService.initializeContract();
        
        // Set flag to refresh blockchain campaigns
        shouldRefreshBlockchain.current = true;
      } catch (error) {
        console.error("Error initializing contract:", error);
        setMetamaskError(`Failed to connect to donation contract: ${error.message}`);
      }
    }
  };

  // Record donation to database
  const recordDonationToDatabase = async (donationData) => {
    try {
      console.log('Sending donation data to backend:', donationData);
      
      // Use axios with full configuration to better debug the issue
      const response = await axios({
        method: 'post',
        url: 'http://localhost:4000/api/donations',
        data: donationData,
        headers: {
          'Content-Type': 'application/json'
        },
        // Set longer timeout since this might be happening after blockchain transaction
        timeout: 10000
      });
      
      console.log('Donation recorded in database:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to record donation in database:', error);
      console.log('Error details:', error.response ? {
        status: error.response.status,
        data: error.response.data
      } : 'No response data');
      // Don't throw here, we don't want to break the donation flow if database recording fails
    }
  };

  // Update local storage after successful donation
  const updateLocalStorage = (donationId, amount) => {
    try {
      // Get current campaigns from localStorage
      const campaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');
      
      // Find and update the campaign
      const updatedCampaigns = campaigns.map(campaign => {
        if (campaign.id === donationId) {
          return {
            ...campaign,
            currentAmount: (parseFloat(campaign.currentAmount) || 0) + parseFloat(amount),
            donors: (campaign.donors || 0) + 1
          };
        }
        return campaign;
      });
      
      // Save back to localStorage
      localStorage.setItem('campaigns', JSON.stringify(updatedCampaigns));
      console.log('Local storage updated for donation:', donationId);
    } catch (error) {
      console.error('Failed to update localStorage:', error);
    }
  };

  const handleDonate = async (donationId, amount) => {
    if (!connectedAccount) {
      setMetamaskError('Please connect to MetaMask first');
      return;
    }
  
    try {
      setLoading(true);
      setTxStatus('processing');
      
      // Find the donation to determine if it's a blockchain donation
      const donation = donations.find(d => d.id === donationId);
      
      if (!donation) {
        throw new Error("Campaign not found");
      }
      
      let txHash;
      
      // Handle donation based on whether it's blockchain or not
      if (donation.isBlockchain) {
        console.log("Processing blockchain donation for campaign ID:", donationId);
        console.log("Donation amount:", amount);
        
        // For blockchain donations, use contractService
        const numericCampaignId = donation.blockchainId;
        
        // Call contract service to donate
        const result = await contractService.donateToCampaign(numericCampaignId, amount);
        console.log('Blockchain donation successful:', result);
        
        txHash = result.transactionHash;
        
        // Set flag to refresh blockchain data on next render
        shouldRefreshBlockchain.current = true;
      } else {
        // For non-blockchain donations, use ethereumService to send direct ETH
        console.log("Processing direct ETH donation to:", donation.ethWalletAddress);
        
        if (!donation.ethWalletAddress) {
          throw new Error("This campaign doesn't have an ETH wallet address");
        }
        
        // Use ethereumService to send donation
        txHash = await ethereumService.donate(amount, donation.ethWalletAddress);
        console.log('Direct ETH donation successful:', txHash);
        
        // Update local state for direct donations
        setDonations(currentDonations => {
          return currentDonations.map(d => {
            if (d.id === donationId) {
              return {
                ...d,
                currentAmount: d.currentAmount + parseFloat(amount),
                donors: d.donors + 1
              };
            }
            return d;
          });
        });
        
        // Update localStorage for non-blockchain donations
        updateLocalStorage(donationId, amount);
      }
      
      // Record the donation to the database
      if (txHash) {
        await recordDonationToDatabase({
          campaignId: donationId,
          amount: parseFloat(amount),
          donor: connectedAccount,
          transactionHash: txHash,
          isBlockchain: donation.isBlockchain,
          blockchainId: donation.blockchainId,
          campaignTitle: donation.title,
          networkName: networkName,
          status: 'completed'
        });
      }
      
      setTxStatus('success');
      return txHash;
    } catch (error) {
      console.error('Donation failed', error);
      setMetamaskError('Donation failed: ' + (error.message || 'Please try again later'));
      setTxStatus('failed');
      throw error; // Rethrow so DonationCard can handle it
    } finally {
      setLoading(false);
      
      // Trigger a refresh after successful donation
      if (txStatus === 'success') {
        shouldRefreshBlockchain.current = true;
      }
      
      // Reset transaction status after 5 seconds
      setTimeout(() => {
        setTxStatus(null);
      }, 5000);
    }
  };

  // Helper function to refresh blockchain campaigns (for manual refresh)
  const refreshBlockchainCampaigns = () => {
    if (connectedAccount) {
      console.log("Manual refresh of blockchain campaigns requested");
      shouldRefreshBlockchain.current = true;
      // Force a re-render to trigger the useEffect
      setLoading(prev => !prev);
      setTimeout(() => setLoading(prev => !prev), 0);
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
        <h1 className="text-3xl font-bold text-white mb-4">Support a Cause</h1>
        <p className="text-lg text-white mb-6">
          Browse through our donation campaigns and contribute using Ethereum through MetaMask.
        </p>
        
        {/* Transaction Status */}
        {txStatus && (
          <div className={`mb-4 p-4 rounded-lg ${
            txStatus === 'processing' ? 'bg-blue-100 text-blue-700' : 
            txStatus === 'success' ? 'bg-green-100 text-green-700' : 
            'bg-red-100 text-red-700'
          }`}>
            {txStatus === 'processing' && 'Processing your donation...'}
            {txStatus === 'success' && 'Donation successful! Thank you for your contribution.'}
            {txStatus === 'failed' && 'Donation failed. Please try again.'}
          </div>
        )}
        
        {/* MetaMask Connection */}
        <div className="mb-6">
          <MetaMaskConnect onAccountChange={handleAccountChange} />
          {connectedAccount && (
            <div className="mt-2 text-sm text-white">
              Connected to {networkName || 'Ethereum network'}
            </div>
          )}
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
        
        {/* Refresh button for blockchain campaigns */}
        {connectedAccount && (
          <button 
            onClick={refreshBlockchainCampaigns}
            className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Refresh Blockchain Campaigns
          </button>
        )}
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
              donation={{
                ...donation,
                // Add a flag to show this is a blockchain campaign in the UI if applicable
                title: donation.isBlockchain ? `${donation.title} (Blockchain)` : donation.title
              }}
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