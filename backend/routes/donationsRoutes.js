// Place this file in your backend/routes folder
import express from 'express';
import { donationController } from '../controllers/donationController.js';

const router = express.Router();

// Record a new donation
router.post('/', donationController.recordDonation);

// Get all donations
router.get('/', donationController.getAllDonations);

// Get donations for a specific campaign
router.get('/campaign/:campaignId', donationController.getDonationsByCampaign);

export default router;