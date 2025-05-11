// Components/DonationStats.jsx
import React, { useState, useEffect } from 'react';
import { transactionService } from '../services/transactionService';
import { ethers } from 'ethers';

const DonationStats = ({ campaignId }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = () => {
      try {
        setLoading(true);
        
        if (campaignId) {
          // Get campaign-specific stats
          const campaignTransactions = transactionService.getTransactionsByCampaignId(campaignId);
          calculateCampaignStats(campaignTransactions);
        } else {
          // Get global stats
          const globalStats = transactionService.getDonationStats();
          setStats(globalStats);
        }
      } catch (error) {
        console.error('Error loading donation stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadStats();
    
    // Refresh stats every minute
    const interval = setInterval(loadStats, 60000);
    return () => clearInterval(interval);
  }, [campaignId]);

  // Calculate stats for a specific campaign
  const calculateCampaignStats = (transactions) => {
    if (!transactions || transactions.length === 0) {
      setStats({
        totalDonations: 0,
        totalAmount: '0',
        totalAmountFormatted: '0 ETH',
        uniqueDonors: 0,
        averageDonation: '0',
        averageDonationFormatted: '0 ETH'
      });
      return;
    }
    
    // Only include confirmed donation transactions
    const confirmedDonations = transactions.filter(tx => 
      tx.status === 'confirmed' && 
      (tx.data.type === 'blockchain-donation' || tx.data.type === 'direct-donation') &&
      tx.data.amountWei
    );
    
    if (confirmedDonations.length === 0) {
      setStats({
        totalDonations: 0,
        totalAmount: '0',
        totalAmountFormatted: '0 ETH',
        uniqueDonors: 0,
        averageDonation: '0',
        averageDonationFormatted: '0 ETH'
      });
      return;
    }
    
    // Calculate total
    let totalWei = ethers.BigNumber.from('0');
    
    confirmedDonations.forEach(tx => {
      try {
        const amountWei = ethers.BigNumber.from(tx.data.amountWei);
        totalWei = totalWei.add(amountWei);
      } catch (error) {
        console.error('Error parsing donation amount:', error);
      }
    });
    
    // Count unique donors
    const uniqueDonorAddresses = new Set();
    confirmedDonations.forEach(tx => {
      if (tx.data.fromAddress) {
        uniqueDonorAddresses.add(tx.data.fromAddress.toLowerCase());
      }
    });
    
    const totalAmount = totalWei.toString();
    const totalAmountFormatted = parseFloat(ethers.utils.formatEther(totalAmount)).toFixed(4) + ' ETH';
    
    const averageDonation = confirmedDonations.length > 0 ? 
      totalWei.div(ethers.BigNumber.from(confirmedDonations.length)).toString() : '0';
    const averageDonationFormatted = parseFloat(ethers.utils.formatEther(averageDonation)).toFixed(4) + ' ETH';
    
    setStats({
      totalDonations: confirmedDonations.length,
      totalAmount,
      totalAmountFormatted,
      uniqueDonors: uniqueDonorAddresses.size,
      averageDonation,
      averageDonationFormatted
    });
  };

  if (loading) {
    return (
      <div className="animate-pulse bg-gray-100 rounded-lg p-6">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        {campaignId ? 'Campaign Donations' : 'Donation Statistics'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total Donations</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.totalDonations}</p>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total Amount</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.totalAmountFormatted}</p>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 mb-1">
            {stats.uniqueDonors !== undefined ? 'Unique Donors' : 'Average Donation'}
          </h3>
          <p className="text-2xl font-bold text-blue-600">
            {stats.uniqueDonors !== undefined ? stats.uniqueDonors : stats.averageDonationFormatted}
          </p>
        </div>
      </div>
      
      {stats.recentDonations && stats.recentDonations.length > 0 && (
        <div className="mt-6">
          <h3 className="text-md font-medium text-gray-700 mb-2">Recent Donations</h3>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.recentDonations.map((tx, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 text-sm text-gray-900 font-mono">
                      {tx.data.fromAddress ? 
                        `${tx.data.fromAddress.substring(0, 6)}...${tx.data.fromAddress.substring(tx.data.fromAddress.length - 4)}` : 
                        'Unknown'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {parseFloat(ethers.utils.formatEther(tx.data.amountWei)).toFixed(4)} ETH
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {tx.data.campaignTitle || (tx.data.campaignId ? `Campaign #${tx.data.campaignId}` : 'Direct')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationStats;