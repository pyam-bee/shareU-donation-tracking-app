// Pages/TransactionHistory.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { transactionService } from '../services/transactionService';
import { ethereumService } from '../services/ethereumService';
import { contractService } from '../services/contractService';
import TransactionCard from '../Components/TransactionCard';
import { ethers } from 'ethers';

const TransactionHistory = () => {
  const { campaignId } = useParams();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState(null);
  const [filter, setFilter] = useState('all');
  const [campaign, setCampaign] = useState(null);
  const [stats, setStats] = useState(null);

  // Connect to wallet and load transactions
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        
        // Initialize contract if needed
        if (!contractService.isInitialized()) {
          await contractService.initializeContract();
        }
        
        // Get connected account
        const accounts = await ethereumService.getAccounts();
        if (accounts && accounts.length > 0) {
          setAccount(accounts[0]);
        }
        
        // Load transactions based on filter
        await loadTransactions();
        
        // Load campaign if campaignId is provided
        if (campaignId) {
          const campaignData = await contractService.getCampaignById(campaignId);
          setCampaign(campaignData);
        }
        
        // Load donation stats
        const donationStats = transactionService.getDonationStats();
        setStats(donationStats);
      } catch (error) {
        console.error('Error initializing transaction history:', error);
      } finally {
        setLoading(false);
      }
    };
    
    init();
  }, [campaignId]);

  // Load transactions when filter changes
  useEffect(() => {
    loadTransactions();
  }, [filter, account, campaignId]);

  // Load transactions based on current filter
  const loadTransactions = async () => {
    try {
      let filteredTransactions = [];
      
      if (campaignId) {
        // Campaign-specific transactions
        filteredTransactions = transactionService.getTransactionsByCampaignId(campaignId);
      } else {
        // Global transaction filters
        switch (filter) {
          case 'my-transactions':
            filteredTransactions = account ? 
              transactionService.getUserTransactions(account) : [];
            break;
          case 'donations':
            filteredTransactions = transactionService.getTransactionsByType('blockchain-donation')
              .concat(transactionService.getTransactionsByType('direct-donation'));
            break;
          case 'campaigns':
            filteredTransactions = transactionService.getTransactionsByType('campaign-creation');
            break;
          case 'pending':
            filteredTransactions = transactionService.getAllTransactions()
              .filter(tx => tx.status === 'pending');
            break;
          case 'confirmed':
            filteredTransactions = transactionService.getAllTransactions()
              .filter(tx => tx.status === 'confirmed');
            break;
          case 'failed':
            filteredTransactions = transactionService.getAllTransactions()
              .filter(tx => tx.status === 'failed');
            break;
          case 'all':
          default:
            filteredTransactions = transactionService.getAllTransactions();
            break;
        }
      }
      
      setTransactions(filteredTransactions);
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  // Format ETH amount
  const formatEth = (weiAmount) => {
    if (!weiAmount) return '0 ETH';
    try {
      return parseFloat(ethers.utils.formatEther(weiAmount)).toFixed(4) + ' ETH';
    } catch (err) {
      return '0 ETH';
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Page Header */}
      {campaignId && campaign ? (
        <div className="mb-6">
          <Link to="/transactions" className="text-blue-600 hover:text-blue-800">
            ← All Transactions
          </Link>
          <h1 className="text-3xl font-bold mt-2">
            Transactions for Campaign: {campaign.title}
          </h1>
          <div className="mt-2 text-white">
            <p>Total Raised: {formatEth(campaign.amountRaised.toString())}</p>
            <p>Status: {campaign.isClosed ? 'Closed' : 'Active'}</p>
          </div>
        </div>
      ) : (
        <h1 className="text-3xl font-bold mb-6 text-white">Transaction History</h1>
      )}

      {/* Stats Section (only show on main transaction page) */}
      {!campaignId && stats && (
        <div className="bg-charity-warm rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-white">Donation Statistics</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 shadow">
              <h3 className="text-gray-700">Total Donations</h3>
              <p className="text-2xl font-bold">{stats.totalDonations}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow">
              <h3 className="text-gray-700">Total Amount</h3>
              <p className="text-2xl font-bold">{stats.totalAmountFormatted}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow">
              <h3 className="text-gray-700">Average Donation</h3>
              <p className="text-2xl font-bold">{stats.averageDonationFormatted}</p>
            </div>
          </div>
        </div>
      )}

      {/* Filter Controls (not shown for campaign-specific view) */}
      {!campaignId && (
        <div className="mb-6">
          <label htmlFor="filter" className="block text-sm font-medium text-white mb-2">
            Filter Transactions:
          </label>
          <select
            id="filter"
            className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Transactions</option>
            <option value="my-transactions">My Transactions</option>
            <option value="donations">Donations Only</option>
            <option value="campaigns">Campaign Creations</option>
            <option value="pending">Pending Transactions</option>
            <option value="confirmed">Confirmed Transactions</option>
            <option value="failed">Failed Transactions</option>
          </select>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-600" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          {/* Transaction List */}
          {transactions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {transactions.map((transaction) => (
                <TransactionCard key={transaction.txHash} transaction={transaction} />
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-12 text-center">
              <h3 className="text-xl font-medium text-white">No transactions found</h3>
              <p className="mt-2 text-white">
                {filter === 'my-transactions' && !account
                  ? 'Please connect your wallet to view your transactions.'
                  : 'There are no transactions matching your current filter.'}
              </p>
              {filter !== 'all' && (
                <button
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => setFilter('all')}
                >
                  View All Transactions
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TransactionHistory;