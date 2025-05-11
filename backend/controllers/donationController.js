import { donationService } from '../../frontend/src/services/donationService.js';

export const donationController = {
  /**
   * Record a new donation
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async recordDonation(req, res) {
    try {
      const donationData = req.body;
      
      // Validate required fields
      if (!donationData.campaignId || !donationData.amount) {
        return res.status(400).json({ 
          success: false, 
          message: 'Campaign ID and amount are required' 
        });
      }
      
      const savedDonation = await donationService.recordDonation(donationData);
      
      res.status(201).json({
        success: true,
        message: 'Donation recorded successfully',
        donation: savedDonation
      });
    } catch (error) {
      console.error('Error in recordDonation controller:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to record donation'
      });
    }
  },

  /**
   * Get all donations
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getAllDonations(req, res) {
    try {
      const donations = await donationService.getAllDonations();
      
      res.status(200).json({
        success: true,
        donations
      });
    } catch (error) {
      console.error('Error in getAllDonations controller:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch donations'
      });
    }
  },

  /**
   * Get donations for a specific campaign
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getDonationsByCampaign(req, res) {
    try {
      const { campaignId } = req.params;
      
      if (!campaignId) {
        return res.status(400).json({
          success: false,
          message: 'Campaign ID is required'
        });
      }
      
      const donations = await donationService.getDonationsByCampaign(campaignId);
      
      res.status(200).json({
        success: true,
        donations
      });
    } catch (error) {
      console.error('Error in getDonationsByCampaign controller:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch campaign donations'
      });
    }
  }
};

export default donationController;