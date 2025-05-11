import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ethers } from 'ethers';

const TransactionCard = ({ transaction }) => {
  if (!transaction) return null;
  
  const { txHash, data, status, timestamp } = transaction;
  
  // Format ETH amount
  const formatEthAmount = (amountWei) => {
    if (!amountWei) return 'N/A';
    try {
      return parseFloat(ethers.utils.formatEther(amountWei)).toFixed(4) + ' ETH';
    } catch (err) {
      return 'N/A';
    }
  };
  
  // Truncate hash/address
  const truncate = (text, startLength = 6, endLength = 4) => {
    if (!text) return 'N/A';
    return `${text.substring(0, startLength)}...${text.substring(text.length - endLength)}`;
  };
  
  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600';
      case 'confirmed':
        return 'text-green-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };
  
  // Get transaction type display
  const getTransactionTypeDisplay = (type) => {
    switch (type) {
      case 'blockchain-donation':
        return 'Contract Donation';
      case 'direct-donation':
        return 'Direct Donation';
      case 'campaign-creation':
        return 'Campaign Creation';
      default:
        return type || 'Transaction';
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-medium">{getTransactionTypeDisplay(data?.type)}</h3>
        <span className={`font-medium ${getStatusColor(status)}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
      
      <div className="space-y-2 text-sm">
        {/* Transaction Hash */}
        <div className="flex justify-between">
          <span className="text-gray-500">Hash:</span>
          <span className="font-mono">{truncate(txHash, 8, 6)}</span>
        </div>
        
        {/* Amount if available */}
        {data?.amountWei && (
          <div className="flex justify-between">
            <span className="text-gray-500">Amount:</span>
            <span className="font-medium">{formatEthAmount(data.amountWei)}</span>
          </div>
        )}
        
        {/* From address */}
        {data?.fromAddress && (
          <div className="flex justify-between">
            <span className="text-gray-500">From:</span>
            <span className="font-mono">{truncate(data.fromAddress)}</span>
          </div>
        )}
        
        {/* To address or campaign */}
        {data?.type === 'blockchain-donation' ? (
          <div className="flex justify-between">
            <span className="text-gray-500">Campaign:</span>
            <span>{data?.campaignTitle || `Campaign #${data?.campaignId}`}</span>
          </div>
        ) : data?.toAddress && (
          <div className="flex justify-between">
            <span className="text-gray-500">To:</span>
            <span className="font-mono">{truncate(data.toAddress)}</span>
          </div>
        )}
        
        {/* Timestamp */}
        <div className="flex justify-between">
          <span className="text-gray-500">Time:</span>
          <span>{timestamp ? formatDistanceToNow(new Date(timestamp), { addSuffix: true }) : 'N/A'}</span>
        </div>
      </div>
      
      {/* View on Etherscan button */}
      <div className="mt-4">
        <a
          href={`https://etherscan.io/tx/${txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          View on Etherscan →
        </a>
      </div>
    </div>
  );
};

export default TransactionCard;