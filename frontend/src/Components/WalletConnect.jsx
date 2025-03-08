// frontend/src/Components/WalletConnect.jsx
import React, { useState } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';

const WalletConnect = ({ onWalletVerified }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError('No Ethereum wallet detected. Please install MetaMask or another wallet.');
      return;
    }

    try {
      setIsConnecting(true);
      setError(null);

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      const address = accounts[0];
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Create a message to sign to verify ownership
      const message = `Connect wallet to donation platform: ${Date.now()}`;
      const signature = await signer.signMessage(message);

      // Verify wallet on backend
      const token = localStorage.getItem('token');
      const response = await axios.post(
        '/api/wallet/verify',
        { address, signature, message },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        // Get updated wallet data
        const walletResponse = await axios.get('/api/wallet/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (walletResponse.data.success) {
          onWalletVerified(walletResponse.data.data);
        }
      }
    } catch (err) {
      console.error('Wallet connection error:', err);
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  // Listen for account changes
  React.useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', () => {
        window.location.reload();
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners();
      }
    };
  }, []);

  return (
    <div className="wallet-connect-container">
      <h2>Connect Your Wallet</h2>
      <p>Connect your Ethereum wallet to make and track donations</p>
      
      {error && <div className="error-message">{error}</div>}
      
      <button 
        className="connect-btn"
        onClick={connectWallet}
        disabled={isConnecting}
      >
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </button>
      
      <div className="wallet-info">
        <h3>Why connect a wallet?</h3>
        <ul>
          <li>Make secure donations using cryptocurrency</li>
          <li>Track your donation history</li>
          <li>Receive donation receipts and certificates</li>
          <li>Participate in donor rewards programs</li>
        </ul>
        
        <h3>Supported Wallets</h3>
        <p>We support MetaMask, WalletConnect, Coinbase Wallet and more.</p>
      </div>
    </div>
  );
};

export default WalletConnect;