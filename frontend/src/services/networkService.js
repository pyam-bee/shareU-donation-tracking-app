// services/networkService.js
import { ethers } from 'ethers';

class NetworkService {
  constructor() {
    this.currentNetwork = null;
    this.provider = null;
  }

  async initialize() {
    if (window.ethereum) {
      try {
        this.provider = new ethers.providers.Web3Provider(window.ethereum);
        this.currentNetwork = await this.provider.getNetwork();
        return true;
      } catch (error) {
        console.error('Error initializing network service:', error);
        return false;
      }
    }
    return false;
  }

  getCurrentNetwork() {
    return this.currentNetwork;
  }

  isLocalNetwork() {
    if (!this.currentNetwork) return false;
    const { chainId } = this.currentNetwork;
    return chainId === 1337 || chainId === 31337 || chainId === 5777;
  }

  getNetworkName(chainId = null) {
    const targetChainId = chainId || this.currentNetwork?.chainId;
    
    if (!targetChainId) return 'Unknown Network';
    
    switch (targetChainId) {
      case 1:
        return 'Ethereum Mainnet';
      case 3:
        return 'Ropsten Testnet';
      case 4:
        return 'Rinkeby Testnet';
      case 5:
        return 'Goerli Testnet';
      case 11155111:
        return 'Sepolia Testnet';
      case 137:
        return 'Polygon Mainnet';
      case 80001:
        return 'Polygon Mumbai';
      case 56:
        return 'BSC Mainnet';
      case 97:
        return 'BSC Testnet';
      case 1337:
      case 31337:
        return 'Hardhat Local';
      case 5777:
        return 'Ganache Local';
      default:
        return `Chain ID: ${targetChainId}`;
    }
  }

  getExplorerUrl(txHash, chainId = null) {
    const targetChainId = chainId || this.currentNetwork?.chainId;
    
    if (!targetChainId || !txHash) return null;
    
    switch (targetChainId) {
      case 1:
        return `https://etherscan.io/tx/${txHash}`;
      case 3:
        return `https://ropsten.etherscan.io/tx/${txHash}`;
      case 4:
        return `https://rinkeby.etherscan.io/tx/${txHash}`;
      case 5:
        return `https://goerli.etherscan.io/tx/${txHash}`;
      case 11155111:
        return `https://sepolia.etherscan.io/tx/${txHash}`;
      case 137:
        return `https://polygonscan.com/tx/${txHash}`;
      case 80001:
        return `https://mumbai.polygonscan.com/tx/${txHash}`;
      case 56:
        return `https://bscscan.com/tx/${txHash}`;
      case 97:
        return `https://testnet.bscscan.com/tx/${txHash}`;
      case 1337:
      case 31337:
      case 5777:
        return null; // No explorer for local networks
      default:
        return null;
    }
  }

  getAddressExplorerUrl(address, chainId = null) {
    const targetChainId = chainId || this.currentNetwork?.chainId;
    
    if (!targetChainId || !address) return null;
    
    switch (targetChainId) {
      case 1:
        return `https://etherscan.io/address/${address}`;
      case 3:
        return `https://ropsten.etherscan.io/address/${address}`;
      case 4:
        return `https://rinkeby.etherscan.io/address/${address}`;
      case 5:
        return `https://goerli.etherscan.io/address/${address}`;
      case 11155111:
        return `https://sepolia.etherscan.io/address/${address}`;
      case 137:
        return `https://polygonscan.com/address/${address}`;
      case 80001:
        return `https://mumbai.polygonscan.com/address/${address}`;
      case 56:
        return `https://bscscan.com/address/${address}`;
      case 97:
        return `https://testnet.bscscan.com/address/${address}`;
      case 1337:
      case 31337:
      case 5777:
        return null;
      default:
        return null;
    }
  }

  // For local development, you can use this to track transactions manually
  async getTransactionReceipt(txHash) {
    if (!this.provider) return null;
    
    try {
      return await this.provider.getTransactionReceipt(txHash);
    } catch (error) {
      console.error('Error getting transaction receipt:', error);
      return null;
    }
  }

  async getTransaction(txHash) {
    if (!this.provider) return null;
    
    try {
      return await this.provider.getTransaction(txHash);
    } catch (error) {
      console.error('Error getting transaction:', error);
      return null;
    }
  }

  // Listen for network changes
  setupNetworkChangeListener(callback) {
    if (window.ethereum) {
      window.ethereum.on('chainChanged', async (chainId) => {
        try {
          this.currentNetwork = await this.provider.getNetwork();
          if (callback) callback(this.currentNetwork);
        } catch (error) {
          console.error('Error handling network change:', error);
        }
      });
    }
  }

  // For local testing, you can log transaction details to console
  logTransactionDetails(txHash, additionalInfo = {}) {
    if (this.isLocalNetwork()) {
      console.group(`🔗 Transaction Details (${this.getNetworkName()})`);
      console.log('Transaction Hash:', txHash);
      console.log('Network:', this.getNetworkName());
      console.log('Chain ID:', this.currentNetwork?.chainId);
      
      if (additionalInfo.type) {
        console.log('Type:', additionalInfo.type);
      }
      if (additionalInfo.amount) {
        console.log('Amount:', additionalInfo.amount);
      }
      if (additionalInfo.from) {
        console.log('From:', additionalInfo.from);
      }
      if (additionalInfo.to) {
        console.log('To:', additionalInfo.to);
      }
      
      console.log('View in console: Copy hash and check your local blockchain logs');
      console.groupEnd();
    }
  }

  // Check if we're on a supported testnet
  isSupportedTestnet() {
    if (!this.currentNetwork) return false;
    const { chainId } = this.currentNetwork;
    return [5, 11155111, 80001, 97].includes(chainId); // Goerli, Sepolia, Mumbai, BSC Testnet
  }

  // Get gas tracker URL for supported networks
  getGasTrackerUrl() {
    if (!this.currentNetwork) return null;
    const { chainId } = this.currentNetwork;
    
    switch (chainId) {
      case 1:
        return 'https://etherscan.io/gastracker';
      case 137:
        return 'https://polygonscan.com/gastracker';
      case 56:
        return 'https://bscscan.com/gastracker';
      default:
        return null;
    }
  }
}

export const networkService = new NetworkService();