import express from 'express';
import * as walletController from '../controllers/walletController.js';
import * as authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Create a new wallet for a user
router.post('/', authMiddleware.protect, walletController.createWallet);

// Get wallet information for the authenticated user
router.get('/me', authMiddleware.protect, walletController.getMyWallet);

// Get wallet by user ID (admin only)
router.get('/user/:userId', authMiddleware.protect, authMiddleware.restrictTo('admin'), walletController.getWalletByUserId);

// Update wallet balance (used after blockchain confirmation)
router.put('/update-balance', authMiddleware.protect, walletController.updateWalletBalance);

// Record a new transaction
router.post('/transaction', authMiddleware.protect, walletController.recordTransaction);

// Get transaction history
router.get('/transactions', authMiddleware.protect, walletController.getTransactionHistory);

// Verify wallet connection
router.post('/verify', authMiddleware.protect, walletController.verifyWalletConnection);

// Get wallet status (connected, balance, etc.)
router.get('/status', authMiddleware.protect, walletController.getWalletStatus);

export default router;