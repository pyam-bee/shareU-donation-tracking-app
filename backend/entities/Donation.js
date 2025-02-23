import mongoose from "mongoose";

const donationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  currentAmount: { type: Number, default: 0 },
  targetAmount: { type: Number, required: true },
  category: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  donors: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    amount: Number,
    date: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Donation", donationSchema);