// Place this file in your backend/entities folder
import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
  campaignId: {
    type: String,
    required: true,
    index: true
  },
  amount: {
    type: Number,
    required: true
  },
  donor: {
    type: String,
    default: 'Anonymous'
  },
  transactionHash: {
    type: String
  },
  isBlockchain: {
    type: Boolean,
    default: false
  },
  blockchainId: {
    type: Number
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  campaignTitle: {
    type: String
  },
  networkName: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'completed'
  }
});

// Create indexes for frequently queried fields
donationSchema.index({ timestamp: -1 });
donationSchema.index({ transactionHash: 1 }, { sparse: true });

const Donation = mongoose.model('Donation', donationSchema);

export default Donation;