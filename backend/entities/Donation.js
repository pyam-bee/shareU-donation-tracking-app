// import mongoose from 'mongoose';

// const DonationSchema = new mongoose.Schema({
//   donationPageId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'DonationPage',
//     required: true
//   },
//   campaignId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Campaign',
//     required: true
//   },
//   amount: {
//     type: Number,
//     required: [true, 'Please provide donation amount'],
//     min: [1, 'Donation amount must be at least 1']
//   },
//   currency: {
//     type: String,
//     default: 'USD'
//   },
//   donor: {
//     name: {
//       type: String,
//       required: [true, 'Please provide donor name']
//     },
//     email: {
//       type: String,
//       required: [true, 'Please provide donor email'],
//       match: [
//         /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
//         'Please provide a valid email'
//       ]
//     },
//     phone: String,
//     address: {
//       street: String,
//       city: String,
//       state: String,
//       zipCode: String,
//       country: String
//     }
//   },
//   paymentMethod: {
//     type: String,
//     required: true
//   },
//   transactionId: {
//     type: String,
//     required: true
//   },
//   status: {
//     type: String,
//     enum: ['pending', 'completed', 'failed', 'refunded'],
//     default: 'pending'
//   },
//   isAnonymous: {
//     type: Boolean,
//     default: false
//   },
//   message: String,
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// export default mongoose.model('Donation', DonationSchema);