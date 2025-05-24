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

  // Force refresh transactions - this will help with showing current donations
  const refreshTransactions = async () => {
    try {
      // Get fresh transaction data
      await loadTransactions();
      if (account) {
        loadUserStats();
      }
    } catch (error) {
      console.error('Error refreshing transactions:', error);
    }
  };

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
        
      } catch (error) {
        console.error('Error initializing transaction history:', error);
      } finally {
        setLoading(false);
      }
    };
    
    init();
  }, [campaignId]);

  // Load transactions when filter changes or account changes
  useEffect(() => {
    loadTransactions();
    // Load user-specific donation stats when account is available
    if (account) {
      loadUserStats();
    }
  }, [filter, account, campaignId]);

  // Auto-refresh transactions every 10 seconds to catch new donations
  useEffect(() => {
    const interval = setInterval(() => {
      refreshTransactions();
    }, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, [account, filter, campaignId]);

  // Load user-specific donation statistics using service method
  const loadUserStats = () => {
    if (!account) {
      setStats(null);
      return;
    }

    try {
      // Use the getUserDonationStats method from transactionService
      const userStats = transactionService.getUserDonationStats(account);
      setStats(userStats);
    } catch (error) {
      console.error('Error loading user stats:', error);
      setStats({
        totalDonations: 0,
        totalAmountFormatted: '0 ETH',
        averageDonationFormatted: '0 ETH'
      });
    }
  };

  // Load transactions based on current filter using proper service methods
  const loadTransactions = async () => {
    try {
      let filteredTransactions = [];
      
      if (campaignId) {
        // Use service method for campaign-specific transactions
        filteredTransactions = transactionService.getTransactionsByCampaignId(campaignId);
      } else {
        // Global transaction filters using proper service methods
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
      
      // Sort transactions by timestamp (newest first)
      filteredTransactions.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      
      setTransactions(filteredTransactions);
    } catch (error) {
      console.error('Error loading transactions:', error);
      setTransactions([]);
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

  // Get network info for display
  const getNetworkInfo = () => {
    if (window.ethereum && window.ethereum.networkVersion) {
      const networkId = window.ethereum.networkVersion;
      
      switch (networkId) {
        case '1':
          return { name: 'Ethereum Mainnet', color: 'text-green-600' };
        case '3':
          return { name: 'Ropsten Testnet', color: 'text-yellow-600' };
        case '4':
          return { name: 'Rinkeby Testnet', color: 'text-yellow-600' };
        case '5':
          return { name: 'Goerli Testnet', color: 'text-yellow-600' };
        case '11155111':
          return { name: 'Sepolia Testnet', color: 'text-yellow-600' };
        case '5777':
          return { name: 'Ganache Local', color: 'text-blue-600' };
        case '1337':
          return { name: 'Hardhat Local', color: 'text-blue-600' };
        default:
          return { name: `Network ${networkId}`, color: 'text-gray-600' };
      }
    }
    return { name: 'Unknown Network', color: 'text-gray-600' };
  };

  const networkInfo = getNetworkInfo();

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Network indicator */}
      <div className="mb-4 flex justify-between items-center">
        <span className={`text-sm ${networkInfo.color} font-medium`}>
          Connected to: {networkInfo.name}
        </span>
        {/* Manual refresh button */}
        <button
          onClick={refreshTransactions}
          className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          🔄 Refresh
        </button>
      </div>

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

      {/* User Stats Section (only show on main transaction page and when user is connected) */}
      {!campaignId && account && stats && (
        <div className="bg-charity-warm rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-white">Your Donation Statistics</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 shadow">
              <h3 className="text-gray-700">Your Total Donations</h3>
              <p className="text-2xl font-bold">{stats.totalDonations}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow">
              <h3 className="text-gray-700">Total Amount Donated</h3>
              <p className="text-2xl font-bold">{stats.totalAmountFormatted}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow">
              <h3 className="text-gray-700">Your Average Donation</h3>
              <p className="text-2xl font-bold">{stats.averageDonationFormatted}</p>
            </div>
          </div>
        </div>
      )}

      {/* Message when wallet not connected */}
      {!campaignId && !account && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
          <p>Connect your wallet to view your personal donation statistics.</p>
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

      {/* Transaction Summary */}
      {transactions.length > 0 && (
        <div className="bg-white rounded-lg p-4 mb-6 shadow">
          <h3 className="text-lg font-semibold mb-2">Transaction Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Total</p>
              <p className="font-medium">{transactions.length}</p>
            </div>
            <div>
              <p className="text-gray-500">Confirmed</p>
              <p className="font-medium text-green-600">
                {transactions.filter(tx => tx.status === 'confirmed').length}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Pending</p>
              <p className="font-medium text-yellow-600">
                {transactions.filter(tx => tx.status === 'pending').length}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Failed</p>
              <p className="font-medium text-red-600">
                {transactions.filter(tx => tx.status === 'failed').length}
              </p>
            </div>
          </div>
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
              <h3 className="text-xl font-medium text-gray-900">No transactions found</h3>
              <p className="mt-2 text-gray-600">
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

      {/* Debug Section for Local Development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 bg-gray-100 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Debug Information</h3>
          <div className="text-sm space-y-1">
            <p><strong>Network:</strong> {networkInfo.name}</p>
            <p><strong>Connected Account:</strong> {account || 'Not connected'}</p>
            <p><strong>Total Transactions in Memory:</strong> {transactionService.getAllTransactions().length}</p>
            <p><strong>Current Filter:</strong> {filter}</p>
            <p><strong>Filtered Results:</strong> {transactions.length}</p>
            <p><strong>Last Refresh:</strong> {new Date().toLocaleTimeString()}</p>
          </div>
          
          {/* Add test transaction button for development */}
          <button
            onClick={() => {
              const testTx = {
                txHash: '0x' + Math.random().toString(16).substr(2, 64),
                data: {
                  type: 'blockchain-donation',
                  amountWei: ethers.utils.parseEther('0.1').toString(),
                  fromAddress: account || '0x1234567890123456789012345678901234567890',
                  campaignId: '1',
                  campaignTitle: 'Test Campaign'
                },
                status: 'confirmed',
                timestamp: Date.now()
              };
              
              transactionService.transactions.push(testTx);
              loadTransactions();
              if (account) loadUserStats();
            }}
            className="mt-2 px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
          >
            Add Test Transaction
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;