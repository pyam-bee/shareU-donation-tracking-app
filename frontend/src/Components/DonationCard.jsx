import React, { useState, useEffect } from 'react';

const DonationCard = ({ donation, onDonate }) => {
  const [donationAmount, setDonationAmount] = useState('0.01');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [txHash, setTxHash] = useState(null);
  const [ethToUsd, setEthToUsd] = useState(0);
  const [showDonateForm, setShowDonateForm] = useState(false);
  
  // Fetch ETH to USD conversion rate
  useEffect(() => {
    const fetchEthPrice = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
        const data = await response.json();
        setEthToUsd(data.ethereum.usd);
      } catch (error) {
        console.error('Failed to fetch ETH price:', error);
        setEthToUsd(3000); // Fallback price
      }
    };
    
    fetchEthPrice();
    // Update price every 5 minutes
    const interval = setInterval(fetchEthPrice, 300000);
    return () => clearInterval(interval);
  }, []);
  
  // Convert ETH to USD
  const ethToUsdConvert = (ethAmount) => {
    return ethAmount * ethToUsd;
  };
  
  // Convert USD to ETH
  const usdToEthConvert = (usdAmount) => {
    return ethToUsd > 0 ? usdAmount / ethToUsd : 0;
  };
  
  // Current amount is in ETH, goal amount is in USD - convert goal to ETH
  const currentAmountEth = parseFloat(donation.currentAmount) || 0;
  const goalAmountUsd = parseFloat(donation.goalAmount) || 0;
  const goalAmountEth = usdToEthConvert(goalAmountUsd);
  
  // Calculate progress percentage using ETH amounts
  const progressPercentage = goalAmountEth > 0 ? Math.min((currentAmountEth / goalAmountEth) * 100, 100) : 0;
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  // Calculate time remaining
  const getTimeRemaining = (endDateString) => {
    const now = new Date();
    const endDate = new Date(endDateString);
    const timeDiff = endDate - now;
    
    if (timeDiff <= 0) {
      return { text: 'Ended', expired: true };
    }
    
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    
    if (days > 1) {
      return { text: `${days} days left`, expired: false };
    } else if (days === 1) {
      return { text: '1 day left', expired: false };
    } else {
      const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      return { text: `${hours} hours left`, expired: false };
    }
  };
  
  const timeRemaining = donation.endDate ? getTimeRemaining(donation.endDate) : null;
  
  // Handle donation submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setTxHash(null);
    
    if (!donationAmount || isNaN(donationAmount) || parseFloat(donationAmount) <= 0) {
      setError('Please enter a valid donation amount');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Pass ETH amount directly - no conversion needed since data is stored in ETH
      const hash = await onDonate(donation.id, donationAmount);
      setTxHash(hash);
      setDonationAmount('0.01'); // Reset form after successful donation
      setShowDonateForm(false);
    } catch (err) {
      setError(err.message || 'Failed to process donation');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Format transaction hash for display
  const formatTxHash = (hash) => {
    if (!hash) return '';
    return `${hash.substring(0, 10)}...${hash.substring(hash.length - 8)}`;
  };
  
  // Determine the transaction explorer URL based on network
  const getExplorerUrl = (hash) => {
    // For local development chain
    if (window.ethereum && window.ethereum.networkVersion === '1337') {
      return `http://localhost:7545/tx/${hash}`;
    }
    // For Goerli testnet
    else if (window.ethereum && window.ethereum.networkVersion === '5') {
      return `https://goerli.etherscan.io/tx/${hash}`;
    }
    // Default to Ethereum mainnet
    return `https://etherscan.io/tx/${hash}`;
  };
  
  // All category badges now use blueish theme
  const getBadgeColor = (category) => {
    const colors = {
      'Blockchain': 'from-blue-500 to-blue-700',
      'Medical': 'from-blue-400 to-blue-600',
      'Education': 'from-blue-500 to-indigo-600',
      'Environment': 'from-teal-500 to-blue-600',
      'Technology': 'from-blue-600 to-purple-600',
      'Emergency': 'from-blue-500 to-cyan-600',
      'Infrastructure': 'from-blue-400 to-blue-700',
      'default': 'from-blue-500 to-blue-700'
    };
    return colors[category] || colors.default;
  };

  // Calculate USD equivalents for display
  const currentUsd = ethToUsdConvert(currentAmountEth);
  const goalUsd = goalAmountUsd; // Already in USD
  const donationUsd = donationAmount ? ethToUsdConvert(parseFloat(donationAmount)) : 0;
  
  return (
    <div className="relative bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden group border border-gray-200">
      {/* Blockchain Badge */}
      {donation.isBlockchain && (
        <div className="absolute top-4 left-16 z-20">
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse flex items-center space-x-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 0L5 9l5 3.5L15 9 10 0zM5 11l5 9 5-9-5 3.5L5 11z" />
            </svg>
            <span>BLOCKCHAIN</span>
          </div>
        </div>
      )}
      
      {/* Image Container with Enhanced Overlay */}
      <div className="relative h-52 overflow-hidden">
        <img 
          src={donation.imageUrl || "/api/placeholder/400/300"} 
          alt={donation.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4 z-10">
          <div className={`bg-gradient-to-r ${getBadgeColor(donation.category)} text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg backdrop-blur-sm border border-white/20`}>
            {donation.category}
          </div>
        </div>
        
        {/* Enhanced Time Remaining Badge - Moved to top right */}
        {timeRemaining && (
          <div className="absolute top-4 right-4 z-10">
            <div className={`px-4 py-2 rounded-full text-sm font-bold shadow-xl backdrop-blur-md border-2 ${
              timeRemaining.expired 
                ? 'bg-red-500/95 text-white border-red-300/50' 
                : 'bg-white/95 text-gray-800 border-white/50'
            }`}>
              <div className="flex items-center space-x-1">
                <span className="text-base">{timeRemaining.expired ? '⏰' : '🕒'}</span>
                <span className="font-extrabold tracking-wide">{timeRemaining.text}</span>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Progress Overlay - Full width at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-lg border border-white/30">
            <div className="flex justify-between text-sm font-bold text-gray-800 mb-3">
              <span className="flex items-center space-x-1">
                <span>📊</span>
                <span>Progress</span>
              </span>
              <span className="text-blue-600 text-lg font-extrabold">
                {progressPercentage.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-300 rounded-full h-3 overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 rounded-full transition-all duration-1000 ease-out relative shadow-sm"
                style={{ 
                  width: `${Math.max(progressPercentage, 0)}%`,
                  minWidth: progressPercentage > 0 ? '2%' : '0%'
                }}
              >
                {progressPercentage > 0 && (
                  <>
                    <div className="absolute inset-0 bg-white/40 animate-pulse rounded-full"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse rounded-full"></div>
                  </>
                )}
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-600 font-medium text-center">
              {currentAmountEth.toFixed(4)} ETH of {goalAmountEth.toFixed(4)} ETH raised
            </div>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {donation.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
          {donation.description}
        </p>
        
        {/* Enhanced Funding Information Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 shadow-sm">
            <div className="text-lg font-bold text-green-700">
              {currentAmountEth.toFixed(4)} ETH
            </div>
            <div className="text-sm text-green-600 font-medium">
              ${currentUsd.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 mt-1 font-medium">💰 Raised</div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 shadow-sm">
            <div className="text-lg font-bold text-blue-700">
              {goalAmountEth.toFixed(4)} ETH
            </div>
            <div className="text-sm text-blue-600 font-medium">
              ${goalUsd.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 mt-1 font-medium">🎯 Goal</div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex justify-between items-center mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span className="text-lg">👥</span>
            <span className="font-medium">{donation.donors} donors</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span className="text-lg">💎</span>
            <span className="font-medium">1 ETH = ${ethToUsd.toLocaleString()}</span>
          </div>
        </div>

        {/* Success Message */}
        {txHash && (
          <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl shadow-sm">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-2xl">🎉</span>
              <p className="text-sm text-green-800 font-bold">Donation Successful!</p>
            </div>
            <p className="text-xs text-green-700">
              Transaction: <span className="font-mono">{formatTxHash(txHash)}</span>
              <button 
                onClick={() => window.open(getExplorerUrl(txHash), '_blank')} 
                className="ml-2 text-blue-600 hover:text-blue-800 font-medium underline"
              >
                View on Explorer
              </button>
            </p>
          </div>
        )}
        
        {/* Enhanced Donation Form */}
        {showDonateForm ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                💸 Donation Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">ETH</span>
                <input
                  type="number"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  placeholder="0.001"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black font-medium transition-all"
                  step="0.001"
                  min="0.001"
                />
              </div>
              {donationAmount && (
                <div className="mt-2 text-center p-2 bg-blue-50 rounded-lg">
                  <span className="text-sm text-blue-700 font-medium">
                    {parseFloat(donationAmount).toFixed(4)} ETH ≈ ${donationUsd.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={isSubmitting || (timeRemaining && timeRemaining.expired)}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 px-6 rounded-xl hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Donating...
                  </div>
                ) : (
                  '💎 Donate Now'
                )}
              </button>
              
              <button
                type="button"
                onClick={() => setShowDonateForm(false)}
                className="px-6 py-3 text-gray-600 border-2 border-gray-300 rounded-xl hover:bg-gray-50 font-medium transition-all"
              >
                Cancel
              </button>
            </div>
            
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-600 font-medium flex items-center">
                  <span className="mr-2">⚠️</span>
                  {error}
                </p>
              </div>
            )}
          </form>
        ) : (
          <button
            onClick={() => setShowDonateForm(true)}
            disabled={timeRemaining && timeRemaining.expired}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-4 px-6 rounded-xl hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            {timeRemaining && timeRemaining.expired ? 
              '⏰ Campaign Ended' : 
              '🚀 Support This Cause'
            }
          </button>
        )}
        
        {/* Owner address for blockchain campaigns */}
        {donation.isBlockchain && donation.ethWalletAddress && (
          <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl">
            <p className="text-xs text-purple-700 font-medium">
              <span className="mr-2">👤</span>
              Campaign Owner: 
              <span className="font-mono ml-1">
                {donation.ethWalletAddress.substring(0, 6)}...{donation.ethWalletAddress.substring(donation.ethWalletAddress.length - 4)}
              </span>
            </p>
          </div>
        )}
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-300 pointer-events-none rounded-2xl"></div>
    </div>
  );
};

export default DonationCard;