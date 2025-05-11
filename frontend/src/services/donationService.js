// Backend service for tracking donations
import mongoose from 'mongoose';
import Donation from '../../../backend/entities/Donation.js';

/**
 * Service for tracking donations in the database
 */
export const donationService = {
  /**
   * Record a new donation in the database
   * @param {Object} donationData - Data for the donation
   * @returns {Promise<Object>} - The saved donation record
   */
  async recordDonation(donationData) {
    try {
      // Create a new donation record
      const donation = new Donation({
        campaignId: donationData.campaignId,
        amount: donationData.amount,
        donor: donationData.donor || 'Anonymous',
        transactionHash: donationData.transactionHash,
        isBlockchain: donationData.isBlockchain || false,
        blockchainId: donationData.blockchainId,
        timestamp: new Date(),
        campaignTitle: donationData.campaignTitle,
        networkName: donationData.networkName,
        status: donationData.status || 'completed'
      });

      // Save the donation to the database
      const savedDonation = await donation.save();
      console.log(`Donation recorded successfully: ${savedDonation._id}`);
      return savedDonation;
    } catch (error) {
      console.error('Error recording donation:', error);
      throw new Error(`Failed to record donation: ${error.message}`);
    }
  },

  /**
   * Get all donations
   * @returns {Promise<Array>} - Array of donation records
   */
  async getAllDonations() {
    try {
      return await Donation.find().sort({ timestamp: -1 });
    } catch (error) {
      console.error('Error fetching donations:', error);
      throw new Error(`Failed to fetch donations: ${error.message}`);
    }
  },

  /**
   * Get donations for a specific campaign
   * @param {string} campaignId - ID of the campaign
   * @returns {Promise<Array>} - Array of donation records for the campaign
   */
  async getDonationsByCampaign(campaignId) {
    try {
      return await Donation.find({ campaignId }).sort({ timestamp: -1 });
    } catch (error) {
      console.error(`Error fetching donations for campaign ${campaignId}:`, error);
      throw new Error(`Failed to fetch campaign donations: ${error.message}`);
    }
  },

  /**
   * Update donation status
   * @param {string} donationId - ID of the donation to update
   * @param {string} status - New status ('completed', 'pending', 'failed')
   * @returns {Promise<Object>} - The updated donation
   */
  async updateDonationStatus(donationId, status) {
    try {
      const updatedDonation = await Donation.findByIdAndUpdate(
        donationId,
        { status },
        { new: true }
      );
      
      if (!updatedDonation) {
        throw new Error('Donation not found');
      }
      
      return updatedDonation;
    } catch (error) {
      console.error(`Error updating donation status for ${donationId}:`, error);
      throw new Error(`Failed to update donation status: ${error.message}`);
    }
  }
};

export default donationService;