import React, { useState } from 'react';
import axios from 'axios';

const DonationCard = ({ donation, onDonate }) => {
  const [donationAmount, setDonationAmount] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const progressPercentage = (donation.currentAmount / donation.targetAmount) * 100;
  
  const handleDonateClick = () => {
    setIsModalOpen(true);
  };
  
  const handleSubmitDonation = async () => {
    if (!donationAmount || isNaN(donationAmount) || donationAmount <= 0) {
      alert('Please enter a valid donation amount');
      return;
    }
    
    await onDonate(donation.id, parseFloat(donationAmount));
    setDonationAmount('');
    setIsModalOpen(false);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Donation image */}
      <div className="h-48 bg-gray-200 flex items-center justify-center">
        {donation.imageUrl ? (
          <img 
            src={donation.imageUrl} 
            alt={donation.title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-500">Donation Image</span>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
            {donation.category}
          </span>
          <span className="text-sm text-gray-600">By {donation.creator}</span>
        </div>
        
        <h3 className="text-lg font-semibold mb-2">{donation.title}</h3>
        <p className="text-gray-600 text-sm mb-4">{donation.description}</p>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between text-sm mb-4">
          <span className="font-medium">
            {donation.currentAmount} ETH raised
          </span>
          <span className="text-gray-600">
            Target: {donation.targetAmount} ETH
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">{donation.donors} donors</span>
          <button 
            onClick={handleDonateClick}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
          >
            Donate
          </button>
        </div>
      </div>
      
      {/* Donation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Donate to {donation.title}</h3>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Amount (ETH)</label>
              <input
                type="number"
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitDonation}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationCard;