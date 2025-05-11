import React, { useState } from 'react';
import { contractService } from '../services/contractService';
import { ethereumService } from '../services/ethereumService';

const DonationForm = ({ campaignId, onDonationComplete }) => {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleDonate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Check if MetaMask is installed
      if (!ethereumService.isMetaMaskInstalled()) {
        setError('MetaMask wallet is not installed. Please install it to make donations.');
        setIsLoading(false);
        return;
      }

      // Connect to wallet if not already connected
      const accounts = await ethereumService.getAccounts();
      if (accounts.length === 0) {
        await ethereumService.connect();
      }

      // Make donation through smart contract
      const result = await contractService.donateToCampaign(campaignId, amount);
      
      setSuccess(`Donation successful! Transaction: ${result.transactionHash}`);
      setAmount('');
      
      if (onDonationComplete) {
        onDonationComplete();
      }
    } catch (error) {
      console.error('Donation error:', error);
      setError(error.message || 'Failed to process donation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded p-6 mb-4">
      <h3 className="text-xl font-semibold mb-4">Make a Donation</h3>
      
      <form onSubmit={handleDonate}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
            Amount (ETH)
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="amount"
            type="number"
            step="0.01"
            placeholder="0.1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Donate'}
          </button>
        </div>
      </form>
      
      {error && (
        <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}
    </div>
  );
};

export default DonationForm;