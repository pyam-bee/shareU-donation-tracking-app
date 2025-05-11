// Components/CampaignTransactions.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { transactionService } from '../services/transactionService';
import { contractService } from '../services/contractService';
import { ethers } from 'ethers';
import TransactionCard from './TransactionCard';
import DonationStats from './DonationStats';

const CampaignTransactions = ({ campaignId }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [campaign, setCampaign] = useState(null);
  const [onChainDonations, setOnChainDonations] = useState([]);
  const [showAllTransactions, setShowAllTransactions] = useState(false);

  useEffect(() => {
    const loadCampaignData = async () => {
      if (!campaignId) return;
      
      try {
        setLoading(true);
        
        // Initialize contract if needed
        if (!contractService.isInitialized()) {
          await contractService.initializeContract();
        }
        
        // Load campaign data
        const campaignData = await contractService.getCampaignById(campaignId);
        setCampaign(campaignData);
        
        // Load campaign donations from blockchain
        const donations = await contractService.getCampaignDonations(campaignId);
        setOnChainDonations(donations);
        
        // Load transactions from localStorage
        const campaignTransactions = transactionService.getTransactionsByCampaignId(campaignId);
        setTransactions(campaignTransactions);
      } catch (error) {
        console.error('Error loading campaign transactions:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadCampaignData();
  }, [campaignId]);

  // Format dates
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  // Format ETH amounts
  const formatEth = (weiAmount) => {
    if (!weiAmount) return '0 ETH';
    try {
      return parseFloat(ethers.utils.formatEther(weiAmount.toString())).toFixed(4) + ' ETH';
    } catch (err) {
      return '0 ETH';
    }
  };

  // Get top donors
  const getTopDonors = () => {
    if (!onChainDonations || onChainDonations.length === 0) return [];
    
    // Group donations by donor
    const donorMap = new Map();
    
    onChainDonations.forEach(donation => {
      const donor = donation.donor;
      const amount = donation.amount;
      
      if (donorMap.has(donor)) {
        donorMap.set(donor, donorMap.get(donor).add(amount));
      } else {
        donorMap.set(donor, amount);
      }
    });
    
    // Convert to array and sort
    return Array.from(donorMap.entries())
      .map(([donor, amount]) => ({ donor, amount }))
      .sort((a, b) => b.amount.sub(a.amount))
      .slice(0, 5);
  };

  if (loading) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
        <p className="mt-4 text-center text-gray-600">Loading campaign transactions...</p>
      </div>
    );
  }

  const topDonors = getTopDonors();
  const displayedTransactions = showAllTransactions 
    ? onChainDonations 
    : onChainDonations.slice(0, 5);

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Campaign Transactions</h2>
      
      {campaign && (
        <div className="mb-6">
          <DonationStats 
            raised={campaign.amountRaised}
            goal={campaign.goalAmount}
            donorsCount={onChainDonations.length}
            daysLeft={campaign.deadline ? Math.max(0, Math.floor((campaign.deadline * 1000 - Date.now()) / (1000 * 60 * 60 * 24))) : 0}
          />
        </div>
      )}

      {onChainDonations.length > 0 ? (
        <>
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Recent Donations</h3>
            <div className="space-y-4">
              {displayedTransactions.map((donation, index) => (
                <TransactionCard
                  key={index}
                  donor={donation.donor}
                  amount={formatEth(donation.amount)}
                  timestamp={formatDate(donation.timestamp)}
                  message={donation.message || ''}
                />
              ))}
            </div>
            {onChainDonations.length > 5 && (
              <button
                onClick={() => setShowAllTransactions(!showAllTransactions)}
                className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
              >
                {showAllTransactions ? 'Show Less' : `Show All (${onChainDonations.length})`}
              </button>
            )}
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Top Donors</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              {topDonors.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {topDonors.map((donor, index) => (
                    <li key={index} className="py-3 flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="bg-blue-100 text-blue-800 font-bold rounded-full h-6 w-6 flex items-center justify-center mr-3">
                          {index + 1}
                        </span>
                        <span className="font-medium truncate max-w-xs">
                          {donor.donor.slice(0, 6)}...{donor.donor.slice(-4)}
                        </span>
                      </div>
                      <span className="font-semibold text-gray-700">{formatEth(donor.amount)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600 text-center py-4">No donors yet</p>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-600 mb-4">No donations have been made to this campaign yet.</p>
          <Link 
            to={`/donate/${campaignId}`}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Be the first to donate
          </Link>
        </div>
      )}
      
      {transactions.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Offchain Transactions</h3>
          <div className="space-y-4">
            {transactions.map((tx, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{tx.type}</span>
                  <span className="text-sm text-gray-500">{new Date(tx.timestamp).toLocaleString()}</span>
                </div>
                <p className="text-gray-600">{tx.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignTransactions;