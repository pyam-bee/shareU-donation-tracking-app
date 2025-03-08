import Wallet from '../entities/Wallet.js';

// Create a new wallet for a user
export const createWallet = async (req, res) => {
  try {
    const { address } = req.body;
    const userId = req.user.id;

    // Check if user already has a wallet
    const existingWallet = await Wallet.findOne({ userId });
    if (existingWallet) {
      return res.status(400).json({
        success: false,
        message: 'User already has a wallet'
      });
    }

    // Create new wallet
    const wallet = await Wallet.create({
      userId,
      address,
      balance: 0,
      transactions: []
    });

    res.status(201).json({
      success: true,
      data: wallet
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get current user's wallet
export const getMyWallet = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.user.id });
    
    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found'
      });
    }

    res.status(200).json({
      success: true,
      data: wallet
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get wallet by user ID (admin only)
export const getWalletByUserId = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.params.userId });
    
    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found'
      });
    }

    res.status(200).json({
      success: true,
      data: wallet
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update wallet balance
export const updateWalletBalance = async (req, res) => {
  try {
    const { balance, txHash } = req.body;
    
    const wallet = await Wallet.findOne({ userId: req.user.id });
    
    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found'
      });
    }

    wallet.balance = balance;
    await wallet.save();

    res.status(200).json({
      success: true,
      data: wallet
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Record a new transaction
export const recordTransaction = async (req, res) => {
  try {
    const { type, amount, txHash } = req.body;
    
    const wallet = await Wallet.findOne({ userId: req.user.id });
    
    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found'
      });
    }

    // Add transaction to history
    wallet.transactions.push({
      type,
      amount,
      txHash,
      timestamp: Date.now(),
      status: 'pending'
    });

    await wallet.save();

    res.status(200).json({
      success: true,
      data: wallet
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get transaction history
export const getTransactionHistory = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.user.id });
    
    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found'
      });
    }

    res.status(200).json({
      success: true,
      data: wallet.transactions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Verify wallet connection
export const verifyWalletConnection = async (req, res) => {
  try {
    const { address, signature, message } = req.body;
    
    // Here you would typically verify the signature using web3 or ethers.js
    // This is a placeholder for the actual verification logic
    const isVerified = true; // Replace with actual verification
    
    if (!isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Wallet verification failed'
      });
    }

    const wallet = await Wallet.findOne({ userId: req.user.id });
    
    if (wallet) {
      // Update existing wallet
      wallet.address = address;
      await wallet.save();
    } else {
      // Create new wallet
      await Wallet.create({
        userId: req.user.id,
        address,
        balance: 0
      });
    }

    res.status(200).json({
      success: true,
      message: 'Wallet verified successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get wallet status
export const getWalletStatus = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.user.id });
    
    const status = {
      connected: !!wallet,
      address: wallet ? wallet.address : null,
      balance: wallet ? wallet.balance : 0,
      network: wallet ? wallet.network : null
    };

    res.status(200).json({
      success: true,
      data: status
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};