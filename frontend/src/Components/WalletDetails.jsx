// frontend/src/Components/WalletDetails.jsx
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import donationContractABI from '../contracts/DonationWallet.json'; // You'll need to create this

const WalletDetails = ({ wallet, transactions, onTransactionRecorded }) => {
  const [balance, setBalance] = useState('0');
  const [networkName, setNetworkName] = useState('');
  const [donationAmount, setDonationAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  
  // Contract details - you'll need to update these with your deployed contract
  const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS || '0x123...'; // Update with your contract address

  useEffect(() => {
    const getWalletDetails = async () => {
      if (window.ethereum && wallet.address) {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          
          // Get network info
          const network = await provider.getNetwork();
          setNetworkName(network.name === 'homestead' ? 'Ethereum Mainnet' : network.name);
          
          // Get wallet balance
          const ethBalance = await provider.getBalance(wallet.address);
          setBalance(ethers.utils.formatEther(ethBalance));
        } catch (err) {
          console.error('Error fetching wallet details:', err);
        }
      }
    };

    getWalletDetails();
  }, [wallet.address]);

  const handleDonate = async () => {
    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      setError('Please enter a valid donation amount');
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      // Create contract instance
      const contract = new ethers.Contract(
        contractAddress,
        donationContractABI.abi,
        signer
      );

      // Make donation
      const tx = await contract.donate({
        value: ethers.utils.parseEther(donationAmount),
      });

      // Wait for transaction to be mined
      const receipt = await tx.wait();
      
      // Record transaction on backend
      const token = localStorage.getItem('token');
      await axios.post(
        '/api/wallet/transaction',
        {
          type: 'donation',
          amount: donationAmount,
          txHash: receipt.transactionHash,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update wallet balance
      const newBalance = await provider.getBalance(wallet.address);
      setBalance(ethers.utils.formatEther(newBalance));
      
      // Update transactions
      if (onTransactionRecorded) {
        onTransactionRecorded();
      }

      // Reset donation amount
      setDonationAmount('');
      
    } catch (err) {
      console.error('Donation error:', err);
      setError(err.message || 'Donation failed');
    } finally {
      setIsProcessing(false);
    }
  };

  // Format date
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  // Format transaction type
  const formatTransactionType = (type) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <div className="wallet-details">
      <div className="wallet-header">
        <h2>Your Wallet</h2>
        <div className="wallet-address">
          {wallet.address.substring(0, 6)}...{wallet.address.substring(wallet.address.length - 4)}
        </div>
      </div>

      <div className="wallet-info-cards">
        <div className="info-card">
          <h3>ETH Balance</h3>
          <div className="balance">{parseFloat(balance).toFixed(4)} ETH</div>
        </div>
        
        <div className="info-card">
          <h3>Network</h3>
          <div className="network">{networkName}</div>
        </div>
        
        <div className="info-card">
          <h3>Total Donations</h3>
          <div className="donations">
            {transactions
              .filter(tx => tx.type === 'donation')
              .reduce((sum, tx) => sum + parseFloat(tx.amount), 0)
              .toFixed(4)} ETH
          </div>
        </div>
      </div>

      <div className="donation-form">
        <h3>Make a Donation</h3>
        {error && <div className="error-message">{error}</div>}
        
        <div className="input-group">
          <input
            type="number"
            placeholder="Amount in ETH"
            value={donationAmount}
            onChange={(e) => setDonationAmount(e.target.value)}
            min="0"
            step="0.01"
          />
          <button 
            onClick={handleDonate} 
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Donate'}
          </button>
        </div>
      </div>

      <div className="transaction-history">
        <h3>Transaction History</h3>
        {transactions.length === 0 ? (
          <p>No transactions yet</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Amount (ETH)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, index) => (
                <tr key={index}>
                  <td>{formatDate(tx.timestamp)}</td>
                  <td>{formatTransactionType(tx.type)}</td>
                  <td>{parseFloat(tx.amount).toFixed(4)}</td>
                  <td className={`status-${tx.status}`}>{tx.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default WalletDetails;