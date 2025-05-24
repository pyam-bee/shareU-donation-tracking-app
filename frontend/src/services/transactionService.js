// services/transactionService.js
import { ethers } from 'ethers';

class TransactionService {
  constructor() {
    this.storageKey = 'donation_app_transactions';
    this.notificationCallback = null;
  }

   setNotificationCallback(callback) {
    this.notificationCallback = callback;
  }

  // Get all transactions from localStorage
  getAllTransactions() {
    try {
      const storedTransactions = localStorage.getItem(this.storageKey);
      if (!storedTransactions) {
        return [];
      }
      return JSON.parse(storedTransactions);
    } catch (error) {
      console.error('Error retrieving transactions:', error);
      return [];
    }
  }

  // Get transaction by hash
  getTransactionByHash(txHash) {
    const transactions = this.getAllTransactions();
    return transactions.find(tx => tx.txHash === txHash);
  }

  // Store a pending transaction
  storePendingTransaction(txHash, data) {
    if (!txHash) {
      console.error('Transaction hash is required');
      return false;
    }

    try {
      const transactions = this.getAllTransactions();
      
      // Check if transaction already exists
      const existingIndex = transactions.findIndex(tx => tx.txHash === txHash);
      
      const newTransaction = {
        txHash,
        data,
        status: 'pending',
        timestamp: Date.now()
      };
      
      if (existingIndex >= 0) {
        // Update existing transaction
        transactions[existingIndex] = {
          ...transactions[existingIndex],
          ...newTransaction
        };
      } else {
        // Add new transaction
        transactions.unshift(newTransaction);
      }
      
      // Save to localStorage
      localStorage.setItem(this.storageKey, JSON.stringify(transactions));
      
      // Notify about pending transaction
      this.notify('Transaction initiated. Please confirm in your wallet...', 'INFO');
      
      return true;
    } catch (error) {
      console.error('Error storing transaction:', error);
      return false;
    }
  }

  async initialize() {
    if (window.ethereum) {
      try {
        this.provider = new ethers.providers.Web3Provider(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        this.signer = this.provider.getSigner();
        return true;
      } catch (error) {
        console.error('Error initializing ethereum service:', error);
        this.notify('Failed to connect to your wallet', 'ERROR');
        return false;
      }
    } else {
      this.notify('Ethereum wallet not detected. Please install MetaMask or another wallet provider.', 'WARNING');
      return false;
    }
  }

  notify(message, type = 'INFO', duration = 5000) {
    if (this.notificationCallback) {
      this.notificationCallback(message, type, duration);
    }
  }

  // Update transaction status
  updateTransactionStatus(txHash, status, receipt = null) {
    if (!txHash) {
      console.error('Transaction hash is required');
      return false;
    }

    try {
      const transactions = this.getAllTransactions();
      const txIndex = transactions.findIndex(tx => tx.txHash === txHash);
      
      if (txIndex === -1) {
        console.error(`Transaction ${txHash} not found`);
        return false;
      }
      
      // Update transaction status
      transactions[txIndex].status = status;
      transactions[txIndex].lastUpdated = Date.now();
      
      // Add receipt if provided
      if (receipt) {
        transactions[txIndex].receipt = {
          blockNumber: receipt.blockNumber,
          gasUsed: receipt.gasUsed?.toString(),
          effectiveGasPrice: receipt.effectiveGasPrice?.toString(),
          status: receipt.status
        };
      }
      
      // Save to localStorage
      localStorage.setItem(this.storageKey, JSON.stringify(transactions));
      
      // Send appropriate notification based on status
      if (status === 'confirmed') {
        this.notify('Transaction confirmed! Thank you for your donation.', 'SUCCESS', 7000);
      } else if (status === 'failed') {
        this.notify('Transaction failed. Please try again.', 'ERROR');
      }
      
      return true;
    } catch (error) {
      console.error('Error updating transaction:', error);
      return false;
    }
  }

  // Filter transactions by type
  getTransactionsByType(type) {
    const transactions = this.getAllTransactions();
    return transactions.filter(tx => tx.data && tx.data.type === type);
  }

  // Get donations for a specific campaign
  getTransactionsByCampaignId(campaignId) {
    if (!campaignId) return [];
    
    const transactions = this.getAllTransactions();
    return transactions.filter(tx => 
      tx.data && 
      tx.data.campaignId && 
      Number(tx.data.campaignId) === Number(campaignId)
    );
  }

  // Get user's transactions
  getUserTransactions(userAddress) {
    if (!userAddress) return [];
    
    const transactions = this.getAllTransactions();
    return transactions.filter(tx => 
      tx.data && 
      tx.data.fromAddress && 
      tx.data.fromAddress.toLowerCase() === userAddress.toLowerCase()
    );
  }

  // Get user-specific donation statistics - NEW METHOD
  getUserDonationStats(userAddress) {
    if (!userAddress) {
      return {
        totalDonations: 0,
        totalAmountFormatted: '0 ETH',
        averageDonationFormatted: '0 ETH'
      };
    }

    try {
      const transactions = this.getAllTransactions();
      
      // Filter for user's confirmed donation transactions
      const userDonations = transactions.filter(tx => 
        tx.status === 'confirmed' && 
        (tx.data?.type === 'blockchain-donation' || tx.data?.type === 'direct-donation') &&
        tx.data?.fromAddress?.toLowerCase() === userAddress.toLowerCase() &&
        tx.data?.amountWei
      );
      
      if (userDonations.length === 0) {
        return {
          totalDonations: 0,
          totalAmountFormatted: '0 ETH',
          averageDonationFormatted: '0 ETH'
        };
      }
      
      // Calculate total amount in Wei
      let totalAmountWei = ethers.BigNumber.from('0');
      
      userDonations.forEach(tx => {
        try {
          const amount = ethers.BigNumber.from(tx.data.amountWei);
          totalAmountWei = totalAmountWei.add(amount);
        } catch (error) {
          console.error('Error parsing donation amount:', tx.data.amountWei, error);
        }
      });

      // Calculate average
      const averageAmountWei = totalAmountWei.div(ethers.BigNumber.from(userDonations.length));

      // Format amounts
      const totalAmountFormatted = parseFloat(ethers.utils.formatEther(totalAmountWei)).toFixed(4) + ' ETH';
      const averageDonationFormatted = parseFloat(ethers.utils.formatEther(averageAmountWei)).toFixed(4) + ' ETH';

      return {
        totalDonations: userDonations.length,
        totalAmountFormatted,
        averageDonationFormatted,
        totalAmountWei: totalAmountWei.toString(),
        averageAmountWei: averageAmountWei.toString()
      };
      
    } catch (error) {
      console.error('Error calculating user donation stats:', error);
      return {
        totalDonations: 0,
        totalAmountFormatted: '0 ETH',
        averageDonationFormatted: '0 ETH'
      };
    }
  }

  // Monitor pending transactions
  async monitorTransactions(provider) {
    try {
      const transactions = this.getAllTransactions().filter(tx => tx.status === 'pending');
      
      // Check status of pending transactions
      for (const tx of transactions) {
        try {
          const receipt = await provider.getTransactionReceipt(tx.txHash);
          
          if (receipt) {
            // Transaction is confirmed
            const status = receipt.status === 1 ? 'confirmed' : 'failed';
            this.updateTransactionStatus(tx.txHash, status, receipt);
            console.log(`Transaction ${tx.txHash} is now ${status}`);
          }
        } catch (err) {
          console.error(`Error checking transaction ${tx.txHash}:`, err);
        }
      }
    } catch (error) {
      console.error('Error monitoring transactions:', error);
    }
  }

  // Clean up old transactions (older than 'days')
  cleanupOldTransactions(days = 30) {
    try {
      const transactions = this.getAllTransactions();
      const cutoffTime = Date.now() - (days * 24 * 60 * 60 * 1000);
      
      const filteredTransactions = transactions.filter(tx => 
        tx.timestamp && tx.timestamp >= cutoffTime
      );
      
      if (filteredTransactions.length !== transactions.length) {
        localStorage.setItem(this.storageKey, JSON.stringify(filteredTransactions));
        console.log(`Cleaned up ${transactions.length - filteredTransactions.length} old transactions`);
      }
    } catch (error) {
      console.error('Error cleaning up transactions:', error);
    }
  }

  // Get overall donation statistics
  getDonationStats() {
    try {
      const transactions = this.getAllTransactions();
      
      // Only include confirmed donation transactions
      const confirmedDonations = transactions.filter(tx => 
        tx.status === 'confirmed' && 
        (tx.data?.type === 'blockchain-donation' || tx.data?.type === 'direct-donation') &&
        tx.data?.amountWei
      );
      
      if (confirmedDonations.length === 0) {
        return {
          totalDonations: 0,
          totalAmount: '0',
          totalAmountFormatted: '0 ETH',
          averageDonation: '0',
          averageDonationFormatted: '0 ETH',
          recentDonations: []
        };
      }
      
      // Calculate total and average
      let totalWei = ethers.BigNumber.from('0');
      
      confirmedDonations.forEach(tx => {
        try {
          const amountWei = ethers.BigNumber.from(tx.data.amountWei);
          totalWei = totalWei.add(amountWei);
        } catch (error) {
          console.error('Error parsing donation amount:', error);
        }
      });
      
      const totalAmount = totalWei.toString();
      const totalAmountFormatted = parseFloat(ethers.utils.formatEther(totalAmount)).toFixed(4) + ' ETH';
      
      const averageDonation = confirmedDonations.length > 0 ? 
        totalWei.div(ethers.BigNumber.from(confirmedDonations.length)).toString() : '0';
      const averageDonationFormatted = parseFloat(ethers.utils.formatEther(averageDonation)).toFixed(4) + ' ETH';
      
      // Get recent donations (last 5)
      const recentDonations = confirmedDonations
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 5);

      return {
        totalDonations: confirmedDonations.length,
        totalAmount,
        totalAmountFormatted,
        averageDonation,
        averageDonationFormatted,
        recentDonations
      };
      
    } catch (error) {
      console.error('Error calculating donation stats:', error);
      return null;
    }
  }

  // Send transaction notification when transaction is sent
  notifyTransactionSent(txHash) {
    this.notify('Transaction sent! Waiting for confirmation...', 'INFO');
  }

  // Send transaction error notification
  notifyTransactionError(error) {
    this.notify(`Transaction failed: ${error.message || 'Unknown error'}`, 'ERROR');
  }
}

export const transactionService = new TransactionService();