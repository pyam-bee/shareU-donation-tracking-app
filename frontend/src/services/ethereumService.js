import { ethers } from "ethers";

// Your smart contract ABI - you'll need to compile your contract to get this
const contractABI = [
  // This should contain the ABI from your DonationWallet.sol compilation
  // Based on your contract, it would include functions like donate, withdraw, etc.
];

// Contract address - you'll get this after deploying your contract
const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS";

export const ethereumService = {
  provider: null,
  signer: null,
  contract: null,

  async connectWallet() {
    // Check if MetaMask is installed
    if (!window.ethereum) {
      throw new Error("MetaMask is not installed");
    }

    try {
      // Request account access
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      
      // Connect to the Ethereum network via MetaMask
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
      this.signer = this.provider.getSigner();
      
      // Initialize contract instance
      this.contract = new ethers.Contract(contractAddress, contractABI, this.signer);
      
      return accounts[0];
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
      throw error;
    }
  },

  async donate(amount) {
    if (!this.contract) {
      throw new Error("Contract not initialized");
    }
    
    try {
      // Convert amount to wei (smallest Ethereum unit)
      const amountInWei = ethers.utils.parseEther(amount.toString());
      
      // Call donate function on the smart contract
      const transaction = await this.contract.donate({ value: amountInWei });
      
      // Wait for transaction to be mined
      return await transaction.wait();
    } catch (error) {
      console.error("Error making donation:", error);
      throw error;
    }
  },

  async getDonationAmount(address) {
    if (!this.contract) {
      throw new Error("Contract not initialized");
    }
    
    try {
      const donationAmount = await this.contract.getDonationAmount(address);
      return ethers.utils.formatEther(donationAmount);
    } catch (error) {
      console.error("Error getting donation amount:", error);
      throw error;
    }
  }
};