import React, { useState, useEffect } from 'react';
import { ethereumService } from '../services/ethereumService';

const MetaMaskConnect = ({ onAccountChange }) => {
  const [connecting, setConnecting] = useState(false);
  const [account, setAccount] = useState(null);
  const [error, setError] = useState(null);
  const [networkName, setNetworkName] = useState('');

  // Check if MetaMask is installed
  const checkIfMetaMaskInstalled = () => {
    return window.ethereum !== undefined;
  };

  // Update network info
  const updateNetworkInfo = async () => {
    try {
      const name = await ethereumService.getNetworkName();
      setNetworkName(name);
    } catch (err) {
      console.error('Error getting network:', err);
    }
  };

  // Handle account changes
  useEffect(() => {
    if (window.ethereum) {
      // Handle account changes
      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          setAccount(null);
          onAccountChange(null);
          setError('Please connect to MetaMask.');
        } else {
          setAccount(accounts[0]);
          onAccountChange(accounts[0]);
        }
      };

      // Handle chain changes
      const handleChainChanged = () => {
        window.location.reload();
      };

      // Check if already connected
      window.ethereum.request({ method: 'eth_accounts' })
        .then(handleAccountsChanged)
        .catch((err) => {
          console.error('Error getting accounts:', err);
        });

      // Get network info
      updateNetworkInfo();

      // Listen for account and chain changes
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [onAccountChange]);

  // Connect to MetaMask
  const connectToMetaMask = async () => {
    if (!checkIfMetaMaskInstalled()) {
      setError('MetaMask is not installed. Please install it from metamask.io');
      return;
    }

    try {
      setConnecting(true);
      setError(null);
      
      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      setAccount(accounts[0]);
      onAccountChange(accounts[0]);
      updateNetworkInfo();
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
      setError(error.message || 'Could not connect to MetaMask');
      onAccountChange(null);
    } finally {
      setConnecting(false);
    }
  };

  // Disconnect (clear local state)
  const disconnect = () => {
    setAccount(null);
    onAccountChange(null);
  };

  // Format account address for display
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <div className="mb-4 sm:mb-0">
          <h3 className="text-lg font-medium text-gray-900">MetaMask Wallet</h3>
          <p className="text-sm text-gray-600">
            {account 
              ? `Connected: ${formatAddress(account)}`
              : 'Connect your wallet to donate with ETH'}
          </p>
          {networkName && (
            <p className="text-xs text-gray-500 mt-1">
              Network: {networkName} 
              {networkName === 'Ganache (Local)' && ' ✓'}
            </p>
          )}
        </div>
        
        <div>
          {!account ? (
            <button
              onClick={connectToMetaMask}
              disabled={connecting}
              className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg flex items-center"
            >
              {connecting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connecting...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 35 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M32.9582 1L19.8241 10.7183L22.2665 4.99099L32.9582 1Z" fill="#E2761B" stroke="#E2761B" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2.04182 1L15.0042 10.809L12.7335 4.99099L2.04182 1Z" fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M28.2379 23.7365L24.7379 29.0819L32.0489 31.1365L34.0979 23.8456L28.2379 23.7365Z" fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M0.902148 23.8456L2.95117 31.1365L10.2621 29.0819L6.76214 23.7365L0.902148 23.8456Z" fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Connect Wallet
                </>
              )}
            </button>
          ) : (
            <button
              onClick={disconnect}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg"
            >
              Disconnect
            </button>
          )}
        </div>
      </div>
      
      {error && (
        <div className="mt-3 text-sm text-red-600">
          {error}
        </div>
      )}
      
      {!checkIfMetaMaskInstalled() && (
        <div className="mt-3 text-sm">
          <p className="text-red-600">MetaMask is not installed.</p>
          <a 
            href="https://metamask.io/download.html" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Download MetaMask
          </a>
        </div>
      )}
    </div>
  );
};

export default MetaMaskConnect;