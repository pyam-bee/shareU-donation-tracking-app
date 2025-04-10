import React, { useState } from 'react';

const DonationCard = ({ donation, onDonate }) => {
  const [donationAmount, setDonationAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Calculate progress percentage
  const progressPercentage = (donation.currentAmount / donation.goalAmount) * 100;
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  // Handle donation submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!donationAmount || isNaN(donationAmount) || parseFloat(donationAmount) <= 0) {
      alert('Please enter a valid donation amount');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onDonate(donation.id, donationAmount);
      setDonationAmount(''); // Reset form after successful donation
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200">
      {/* Image */}
      <div className="relative h-48 bg-gray-200">
        <img 
          src={donation.imageUrl || "/api/placeholder/400/300"} 
          alt={donation.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
          {donation.category}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{donation.title}</h3>
        
        <p className="text-gray-600 mb-4 line-clamp-3">{donation.description}</p>
        
        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>${donation.currentAmount.toLocaleString()} raised</span>
            <span>Goal: ${donation.goalAmount.toLocaleString()}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{donation.donors} donors</span>
            {donation.endDate && (
              <span>Ends: {formatDate(donation.endDate)}</span>
            )}
          </div>
        </div>
        
        {/* Donation form */}
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="flex">
            <div className="relative flex-grow">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
                placeholder="Amount"
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-l-lg focus:ring-blue-500 focus:border-blue-500"
                step="0.01"
                min="0"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Donating...
                </span>
              ) : (
                'Donate'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DonationCard;