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

  // Get explorer URL for the current network - FIXED VERSION
  const getExplorerUrl = () => {
    if (window.ethereum && window.ethereum.networkVersion) {
      const networkId = window.ethereum.networkVersion;
      
      switch (networkId) {
        case '1':
          return 'https://etherscan.io';
        case '3':
          return 'https://ropsten.etherscan.io';
        case '4':
          return 'https://rinkeby.etherscan.io';
        case '5':
          return 'https://goerli.etherscan.io';
        case '11155111':
          return 'https://sepolia.etherscan.io';
        default:
          return null; // Local networks don't have explorers
      }
    }
    return null;
  };

  const explorerUrl = getExplorerUrl();
  
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

        {/* Gas Used (if available from receipt) */}
        {transaction.receipt?.gasUsed && (
          <div className="flex justify-between">
            <span className="text-gray-500">Gas Used:</span>
            <span>{Number(transaction.receipt.gasUsed).toLocaleString()}</span>
          </div>
        )}

        {/* Block Number (if available from receipt) */}
        {transaction.receipt?.blockNumber && (
          <div className="flex justify-between">
            <span className="text-gray-500">Block:</span>
            <span>#{transaction.receipt.blockNumber}</span>
          </div>
        )}
      </div>
      
      {/* Explorer link or local network indicator */}
      <div className="mt-4">
        {explorerUrl ? (
          <a
            href={`${explorerUrl}/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            View on Block Explorer →
          </a>
        ) : (
          <div className="text-gray-500 text-sm">
            Local Network - No block explorer available
          </div>
        )}
      </div>

      {/* Copy transaction hash button */}
      <div className="mt-2">
        <button
          onClick={() => {
            navigator.clipboard.writeText(txHash);
            // You could add a toast notification here
            alert('Transaction hash copied to clipboard!');
          }}
          className="text-gray-600 hover:text-gray-800 text-sm"
        >
          📋 Copy Transaction Hash
        </button>
      </div>
    </div>
  );
};

export default TransactionCard;