// services/ethereumService.js
import { transactionService } from './transactionService';

const ethereumService = {
  // Store the recipient address
  recipientAddress: null,
  
  // Set recipient address
  setRecipientAddress(address) {
    this.recipientAddress = address;
  },
  
  // Get recipient address
  getRecipientAddress() {
    if (!this.recipientAddress) {
      throw new Error('Recipient address not set');
    }
    return this.recipientAddress;
  },

  // Check if MetaMask is installed
  isMetaMaskInstalled() {
    return window.ethereum !== undefined;
  },
  
  // Check if connected to Ganache
  async isGanacheNetwork() {
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      // Ganache App uses chain ID 1337 (0x539)
      return chainId === '0x539';
    } catch (error) {
      return false;
    }
  },
  
  // Get current network ID
  async getNetworkId() {
    if (!this.isMetaMaskInstalled()) {
      throw new Error('MetaMask is not installed');
    }
    
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      return parseInt(chainId, 16);
    } catch (error) {
      console.error('Error getting network ID:', error);
      throw error;
    }
  },
  
  // Get network name
  async getNetworkName() {
    const chainId = await this.getNetworkId();
    const networks = {
      1: 'Ethereum Mainnet',
      3: 'Ropsten',
      4: 'Rinkeby',
      5: 'Goerli',
      42: 'Kovan',
      56: 'Binance Smart Chain',
      137: 'Polygon',
      80001: 'Mumbai (Polygon Testnet)',
      1337: 'Ganache (Local)',
      31337: 'Hardhat (Local)'
    };
    
    return networks[chainId] || `Chain ID: ${chainId}`;
  },
  
  // Get connected accounts
  async getAccounts() {
    if (!this.isMetaMaskInstalled()) {
      throw new Error('MetaMask is not installed');
    }
    
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      return accounts;
    } catch (error) {
      console.error('Error getting accounts:', error);
      throw error;
    }
  },
  
  // Connect to MetaMask
  async connect() {
    if (!this.isMetaMaskInstalled()) {
      throw new Error('MetaMask is not installed');
    }
    
    try {
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      return accounts[0];
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
      throw error;
    }
  },
  
  // Make a donation transaction
  async donate(amount, recipientAddress, campaignData = {}) {
    if (!this.isMetaMaskInstalled()) {
      throw new Error('MetaMask is not installed');
    }
    
    try {
      const accounts = await this.getAccounts();
      
      if (accounts.length === 0) {
        throw new Error('No connected accounts');
      }
      
      // Use provided recipient address or try to get it from the service
      const toAddress = recipientAddress || this.recipientAddress;
      
      if (!toAddress) {
        throw new Error('Recipient address not set');
      }
      
      const fromAddress = accounts[0];
      
      // Convert amount to wei (1 ETH = 10^18 wei)
      const amountInWei = parseInt(Number(amount) * 1e18).toString(16);
      
      // Ganache-specific gas settings
      const isGanache = await this.isGanacheNetwork();
      const gasPrice = isGanache ? undefined : '0x3b9aca00'; // 1 gwei
      
      // Create transaction parameters
      const transactionParameters = {
        from: fromAddress,
        to: toAddress,
        value: '0x' + amountInWei, // Value in wei, converted to hex
        gas: '0x5208', // 21000 gas in hex
        gasPrice: gasPrice // Only set for non-Ganache networks
      };
      
      // Store transaction data for tracking
      const pendingTxData = {
        type: 'direct-donation',
        amount: amount,
        amountWei: parseInt(Number(amount) * 1e18).toString(),
        fromAddress: fromAddress,
        toAddress: toAddress,
        timestamp: Date.now(),
        ...campaignData  // Include any campaign data passed in
      };
      
      // Log transaction details for debugging
      console.log('Sending transaction:', transactionParameters);
      
      // Send transaction
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });
      
      // Store pending transaction
      transactionService.storePendingTransaction(txHash, pendingTxData);
      
      // Create a provider to track transaction
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      
      // Wait for confirmation
      provider.once(txHash, (transaction) => {
        console.log('Transaction confirmed:', transaction);
        transactionService.updateTransactionStatus(txHash, 'confirmed', transaction);
      });
      
      console.log('Transaction sent:', txHash);
      return txHash;
    } catch (error) {
      console.error('Error donating:', error);
      throw error;
    }
  },
  
  // Get transaction details
  async getTransactionDetails(txHash) {
    if (!this.isMetaMaskInstalled()) {
      throw new Error('MetaMask is not installed');
    }
    
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const tx = await provider.getTransaction(txHash);
      const receipt = await provider.getTransactionReceipt(txHash);
      
      return {
        transaction: tx,
        receipt: receipt
      };
    } catch (error) {
      console.error('Error getting transaction details:', error);
      throw error;
    }
  }
};

// Add ethers import at the top
import { ethers } from 'ethers';

export { ethereumService };