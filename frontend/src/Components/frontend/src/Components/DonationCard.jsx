import React from 'react';
import { useState } from 'react';

const DonationCard = ({ donation, onDonate }) => {
  const [donationAmount, setDonationAmount] = useState('');

  const handleDonate = async (e) => {
    e.preventDefault();
    if (!donationAmount) return;
    await onDonate(donationAmount);
    setDonationAmount('');
  };

  const calculateProgress = () => {
    return (donation.currentAmount / donation.targetAmount) * 100;
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-semibold text-gray-900">{donation.title}</h3>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            {donation.category}
          </span>
        </div>
        
        <p className="mt-2 text-gray-600">{donation.description}</p>
        
        <div className="mt-4">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">
              {donation.currentAmount} ETH raised
            </span>
            <span className="text-sm font-medium text-gray-700">
              {donation.targetAmount} ETH goal
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-indigo-600 h-2 rounded-full" 
              style={{ width: `${calculateProgress()}%` }}
            />
          </div>
        </div>

        <form onSubmit={handleDonate} className="mt-4">
          <div className="flex space-x-2">
            <input
              type="number"
              step="0.01"
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Amount in ETH"
            />
            <button
              type="submit"
              className="inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Donate
            </button>
          </div>
        </form>

        <div className="mt-4 border-t pt-4">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Created by: {donation.creator}</span>
            <span>{donation.donors} donors</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationCard;