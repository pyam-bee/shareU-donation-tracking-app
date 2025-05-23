import { ethers } from 'ethers';
import DonationCampaignABI from '../contracts/DonationCampaign.json';
import { transactionService } from './transactionService';

class ContractService {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.contract = null;
    this.contractAddress = '0x50cCe81e2e4378bd8A7B849A50a88e6753BF60aC';
    this.initialized = false;
    this.monitoringInterval = null;
  }
  
  isInitialized() {
    return this.initialized;
  }

  
  async initializeContract() {
    // Don't re-initialize if already done
    if (this.initialized) {
      return true;
    }
    
    try {
      // Check if MetaMask is installed
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
      }
      
      // Connect to provider
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
      
      // Get signer
      this.signer = this.provider.getSigner();
      
      // Create contract instance
      this.contract = new ethers.Contract(
        this.contractAddress,
        DonationCampaignABI.abi, // Make sure this points to your contract ABI
        this.signer
      );

      // Start monitoring pending transactions
      this.startTransactionMonitoring();
      
      console.log('Contract initialized successfully');
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize contract:', error);
      this.initialized = false;
      throw error;
    }
  }

  // Start monitoring pending transactions
  startTransactionMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }
    
    // Check pending transactions every 15 seconds
    this.monitoringInterval = setInterval(() => {
      if (this.provider) {
        transactionService.monitorTransactions(this.provider);
      }
    }, 15000);
    
    // Clean up old transactions daily
    setInterval(() => {
      transactionService.cleanupOldTransactions(7); // 7 days
    }, 24 * 60 * 60 * 1000);
  }
  
  // Get a single campaign by ID
  async getCampaignById(campaignId) {
    try {
      if (!this.initialized) {
        await this.initializeContract();
      }
      
      // Convert to number if it's a string
      const numericId = Number(campaignId);
      if (isNaN(numericId) || numericId <= 0) {
        throw new Error('Invalid campaign ID');
      }
      
      console.log(`Getting campaign with ID: ${numericId}`);
      const campaign = await this.contract.getCampaignById(numericId);
      return campaign;
    } catch (error) {
      console.error(`Error getting campaign with ID ${campaignId}:`, error);
      throw error;
    }
  }
  
  // Get all campaigns from the contract with error handling
  async getAllCampaigns() {
    try {
      if (!this.initialized) {
        await this.initializeContract();
      }
      
      const campaigns = await this.contract.getAllCampaigns();
      return campaigns || []; // Return empty array if null/undefined
    } catch (error) {
      console.error('Error getting all campaigns:', error);
      return []; // Return empty array on error instead of throwing
    }
  }
  
  // Get campaign donations
  async getCampaignDonations(campaignId) {
    try {
      if (!this.initialized) {
        await this.initializeContract();
      }
      
      const numericId = Number(campaignId);
      if (isNaN(numericId) || numericId <= 0) {
        throw new Error('Invalid campaign ID');
      }
      
      const donations = await this.contract.getCampaignDonations(numericId);
      return donations || [];
    } catch (error) {
      console.error(`Error getting donations for campaign ${campaignId}:`, error);
      return [];
    }
  }
  
  // Get donations made by a user
  async getUserDonations(userAddress) {
    try {
      if (!this.initialized) {
        await this.initializeContract();
      }
      
      if (!userAddress) {
        throw new Error('User address is required');
      }
      
      const donations = await this.contract.getUserDonations(userAddress);
      return donations || [];
    } catch (error) {
      console.error(`Error getting donations for user ${userAddress}:`, error);
      return [];
    }
  }
  
  // Donate to a campaign with proper validation
  async donateToCampaign(campaignId, amount) {
    try {
      if (!this.initialized) {
        await this.initializeContract();
      }
      
      // Validate inputs
      const numericCampaignId = Number(campaignId);
      if (isNaN(numericCampaignId) || numericCampaignId <= 0) {
        throw new Error('Invalid campaign ID');
      }
      
      const numericAmount = Number(amount);
      if (isNaN(numericAmount) || numericAmount <= 0) {
        throw new Error('Invalid donation amount');
      }
      
      console.log(`Preparing to donate ${amount} ETH to campaign ID: ${numericCampaignId}`);
      
      // Campaign validation
      let campaign;
      try {
        campaign = await this.getCampaignById(numericCampaignId);
        
        // Check campaign status
        if (!campaign.isApproved) {
          throw new Error('This campaign has not been approved');
        }
        
        if (campaign.isClosed) {
          throw new Error('This campaign is closed to donations');
        }
        
        // Check deadline
        const currentTime = Math.floor(Date.now() / 1000);
        if (currentTime >= campaign.deadline.toNumber()) {
          throw new Error('The deadline for this campaign has passed');
        }
        
      } catch (error) {
        console.error('Campaign validation error:', error);
        throw new Error(`Campaign validation failed: ${error.message}`);
      }
      
      // Convert ETH amount to wei
      const amountInWei = ethers.utils.parseEther(amount.toString());
      
      // Get current account
      const accounts = await this.provider.listAccounts();
      const fromAddress = accounts[0];
      
      // Store pending transaction data
      const pendingTxData = {
        type: 'blockchain-donation',
        campaignId: numericCampaignId,
        amount: amount,
        amountWei: amountInWei.toString(),
        fromAddress: fromAddress,
        campaignTitle: campaign.title,
        timestamp: Date.now()
      };
      
      // Send transaction to contract
      console.log(`Sending donation transaction of ${amountInWei.toString()} wei`);
      const tx = await this.contract.donate(numericCampaignId, {
        value: amountInWei
      });
      
      // Store pending transaction
      transactionService.storePendingTransaction(tx.hash, pendingTxData);
      
      console.log('Waiting for transaction confirmation...');
      const receipt = await tx.wait();
      console.log('Donation transaction confirmed:', receipt);
      
      // Update transaction status to confirmed
      transactionService.updateTransactionStatus(tx.hash, 'confirmed', receipt);
      
      // Parse donation event
      try {
        const donationEvent = receipt.events.find(event => 
          event.event === 'DonationReceived'
        );
        
        if (donationEvent) {
          console.log('Donation event:', donationEvent);
        }
      } catch (error) {
        console.error('Error parsing donation event:', error);
      }
      
      return receipt;
    } catch (error) {
      console.error('Error donating to campaign:', error);
      
      // Parse meaningful error message from blockchain error
      if (error.message.includes('user rejected transaction')) {
        throw new Error('Transaction was rejected in MetaMask');
      } else if (error.message.includes('insufficient funds')) {
        throw new Error('Insufficient funds in your wallet');
      } else {
        throw error;
      }
    }
  }
  
  // Create a new campaign (admin functionality)
  async createCampaign(title, description, fundingGoal, durationInDays) {
    try {
      if (!this.initialized) {
        await this.initializeContract();
      }
      
      // Validate inputs
      if (!title || !description) {
        throw new Error('Title and description are required');
      }
      
      if (isNaN(fundingGoal) || fundingGoal <= 0) {
        throw new Error('Funding goal must be a positive number');
      }
      
      if (isNaN(durationInDays) || durationInDays <= 0) {
        throw new Error('Duration must be a positive number of days');
      }
      
      // Convert fundingGoal from ETH to wei
      const fundingGoalInWei = ethers.utils.parseEther(fundingGoal.toString());
      
      // Get current account
      const accounts = await this.provider.listAccounts();
      const fromAddress = accounts[0];
      
      // Store pending transaction data
      const pendingTxData = {
        type: 'campaign-creation',
        title: title,
        description: description, 
        fundingGoal: fundingGoal,
        fundingGoalWei: fundingGoalInWei.toString(),
        durationInDays: durationInDays,
        fromAddress: fromAddress,
        timestamp: Date.now()
      };
      
      // Call contract method
      const tx = await this.contract.createCampaign(
        title,
        description,
        fundingGoalInWei,
        durationInDays
      );
      
      // Store pending transaction
      transactionService.storePendingTransaction(tx.hash, pendingTxData);
      
      console.log('Campaign creation transaction sent, waiting for confirmation...');
      const receipt = await tx.wait();
      
      // Update transaction status to confirmed
      transactionService.updateTransactionStatus(tx.hash, 'confirmed', receipt);
      
      // Get campaign ID from event
      const event = receipt.events.find(e => e.event === 'CampaignCreated');
      if (!event || !event.args) {
        throw new Error('Campaign created but ID could not be retrieved');
      }
      
      const campaignId = event.args.campaignId.toNumber();
      console.log(`Campaign created with ID: ${campaignId}`);
      
      return {
        receipt,
        campaignId
      };
    } catch (error) {
      console.error('Error creating campaign:', error);
      throw error;
    }
  }
}

export const contractService = new ContractService();