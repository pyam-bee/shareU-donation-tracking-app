// import DonationPage from '../entities/DonationPage.js';
// import Campaign from '../entities/Campaign.js';
// import Donation from '../entities/Donation.js';
// import { processPayment } from '../utils/paymentProcessor.js';

// // Get donation page by slug
// export const getDonationPage = async (req, res) => {
//   try {
//     const donationPage = await DonationPage.findOne({ slug: req.params.slug, isActive: true });
    
//     if (!donationPage) {
//       return res.status(404).json({
//         success: false,
//         message: 'Donation page not found'
//       });
//     }

//     // Get associated campaign information
//     const campaign = await Campaign.findById(donationPage.campaignId);
//     if (!campaign) {
//       return res.status(404).json({
//         success: false,
//         message: 'Associated campaign not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: {
//         donationPage,
//         campaign: {
//           title: campaign.title,
//           description: campaign.description,
//           goal: campaign.goal,
//           image: campaign.image
//         }
//       }
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Server Error'
//     });
//   }
// };

// // Process donation
// export const processDonation = async (req, res) => {
//   try {
//     const { pageId, amount, paymentMethod, paymentDetails, donorInfo, isAnonymous, message } = req.body;

//     // Find donation page
//     const donationPage = await DonationPage.findById(pageId);
//     if (!donationPage) {
//       return res.status(404).json({
//         success: false,
//         message: 'Donation page not found'
//       });
//     }

//     // Process payment
//     const paymentResult = await processPayment({
//       amount,
//       currency: 'USD',
//       paymentMethod,
//       paymentDetails
//     });

//     if (!paymentResult.success) {
//       return res.status(400).json({
//         success: false,
//         message: paymentResult.message
//       });
//     }

//     // Create donation record
//     const donation = await Donation.create({
//       donationPageId: pageId,
//       campaignId: donationPage.campaignId,
//       amount,
//       donor: donorInfo,
//       paymentMethod,
//       transactionId: paymentResult.transactionId,
//       status: 'completed',
//       isAnonymous,
//       message
//     });

//     res.status(201).json({
//       success: true,
//       data: {
//         donationId: donation._id,
//         amount,
//         transactionId: paymentResult.transactionId,
//         thankYouMessage: donationPage.thankYouMessage
//       }
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Server Error'
//     });
//   }
// };

// // Get donation statistics for a campaign
// export const getDonationStats = async (req, res) => {
//   try {
//     const { campaignId } = req.params;
    
//     // Verify campaign exists
//     const campaign = await Campaign.findById(campaignId);
//     if (!campaign) {
//       return res.status(404).json({
//         success: false,
//         message: 'Campaign not found'
//       });
//     }

//     // Get total donation amount
//     const donations = await Donation.find({ 
//       campaignId, 
//       status: 'completed' 
//     });
    
//     const totalDonated = donations.reduce((sum, donation) => sum + donation.amount, 0);
//     const donorCount = new Set(donations.map(d => d.donor.email)).size;
    
//     // Calculate percentage of goal reached
//     const percentageReached = (totalDonated / campaign.goal) * 100;

//     res.status(200).json({
//       success: true,
//       data: {
//         totalDonated,
//         donorCount,
//         goal: campaign.goal,
//         percentageReached: Math.min(percentageReached, 100).toFixed(2),
//         donationsCount: donations.length
//       }
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Server Error'
//     });
//   }
// };
