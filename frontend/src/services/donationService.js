import Donation from '../../../backend/entities/Donation.js';
import { campaignService } from './campaignService.js';

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
        userId: donationData.userId,
        userName: donationData.userName,
        anonymous: donationData.anonymous || false,
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
      
      // Send notification for the donation
      await this.notifyDonation(savedDonation, donationData.campaignId);
      
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
  },

  /**
   * Notify users about donation
   * @param {Object} donation - The donation object
   * @param {string} campaignId - ID of the campaign
   */
  async notifyDonation(donation, campaignId) {
    try {
      // Get campaign information
      const campaign = await campaignService.getCampaignById(campaignId);
      
      if (!campaign) {
        console.error(`Campaign ${campaignId} not found for donation notification`);
        return;
      }
      
      // 1. Notify donor
      if (donation.userId) {
        notifyUser(donation.userId, {
          message: `Thank you for your donation of ${this.formatCurrency(donation.amount)} to "${campaign.title}"!`,
          notificationType: 'success',
          duration: 7000,
          action: 'open_donation',
          donationId: donation._id
        });
      }
      
      // 2. Notify campaign owner
      if (campaign.userId) {
        const donorName = donation.anonymous ? 'Anonymous' : (donation.userName || 'Someone');
        notifyUser(campaign.userId, {
          message: `${donorName} donated ${this.formatCurrency(donation.amount)} to your campaign "${campaign.title}"!`,
          notificationType: 'success',
          duration: 7000,
          action: 'open_campaign',
          campaignId
        });
      }
      
      // 3. Update campaign progress and notify if goal reached
      if (campaign.goal) {
        // Calculate progress
        const totalRaised = await campaignService.calculateTotalRaised(campaignId);
        const progress = (totalRaised / campaign.goal) * 100;
        
        // If goal reached, notify campaign owner
        if (totalRaised >= campaign.goal && campaign.status !== 'completed') {
          // Update campaign status to completed
          await campaignService.updateCampaignStatus(campaignId, 'completed');
          
          // Notify campaign owner
          notifyUser(campaign.userId, {
            message: `Congratulations! Your campaign "${campaign.title}" has reached its funding goal!`,
            notificationType: 'success',
            duration: 10000,
            action: 'open_campaign',
            campaignId
          });
        }
        // If milestone reached (e.g., 50%, 75%)
        else if (progress >= 75 && campaign.lastMilestoneNotified !== '75') {
          notifyUser(campaign.userId, {
            message: `Your campaign "${campaign.title}" has reached 75% of its funding goal!`,
            notificationType: 'info',
            duration: 7000,
            action: 'open_campaign',
            campaignId
          });
          
          // Update last milestone notified
          await campaignService.updateCampaignMilestone(campaignId, '75');
        }
        else if (progress >= 50 && campaign.lastMilestoneNotified !== '50' && campaign.lastMilestoneNotified !== '75') {
          notifyUser(campaign.userId, {
            message: `Your campaign "${campaign.title}" has reached 50% of its funding goal!`,
            notificationType: 'info',
            duration: 7000,
            action: 'open_campaign',
            campaignId
          });
          
          // Update last milestone notified
          await campaignService.updateCampaignMilestone(campaignId, '50');
        }
      }
    } catch (error) {
      console.error('Error sending donation notification:', error);
    }
  },

  /**
   * Helper function to format currency
   * @param {number} amount - The amount to format
   * @param {string} currency - Currency code (default: USD)
   * @returns {string} - Formatted currency string
   */
  formatCurrency(amount, currency = 'USD') {
    try {
      return new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency 
      }).format(amount);
    } catch (error) {
      return `${currency} ${amount}`;
    }
  }
};

export default donationService;