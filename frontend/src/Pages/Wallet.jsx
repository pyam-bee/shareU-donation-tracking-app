// frontend/src/Pages/Wallet.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WalletConnect from '../Components/WalletConnect';
import WalletDetails from '../Components/WalletDetails';
import axios from 'axios';

const Wallet = () => {
  const [walletData, setWalletData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  // Fetch wallet data
  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/wallet/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.success) {
          setWalletData(response.data.data);
          fetchTransactions();
        }
      } catch (err) {
        if (err.response?.status !== 404) {
          // Only set as error if it's not a "wallet not found" error
          setError('Failed to load wallet data');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchWalletData();
  }, []);

  // Fetch transactions
  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/wallet/transactions', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setTransactions(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
    }
  };

  // Handle wallet verification
  const handleWalletVerified = (walletInfo) => {
    setWalletData(walletInfo);
    fetchTransactions();
  };

  // Handle transaction recording
  const handleTransactionRecorded = () => {
    fetchTransactions();
  };

  return (
    <div className="wallet-page">
      <h1>My Wallet</h1>
      
      {isLoading ? (
        <div className="loading">Loading wallet information...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <>
          {!walletData ? (
            <WalletConnect onWalletVerified={handleWalletVerified} />
          ) : (
            <WalletDetails 
              wallet={walletData} 
              transactions={transactions}
              onTransactionRecorded={handleTransactionRecorded}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Wallet;