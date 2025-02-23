import Donation from "../entities/Donation.js";

export const getDonations = async (req, res) => {
  try {
    const donations = await Donation.find().populate("creator", "name");
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createDonation = async (req, res) => {
  try {
    const donation = new Donation({
      ...req.body,
      creator: req.user.id
    });
    await donation.save();
    res.status(201).json(donation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const donateToCampaign = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) return res.status(404).json({ message: "Donation not found" });

    donation.currentAmount += req.body.amount;
    donation.donors.push({
      user: req.user.id,
      amount: req.body.amount
    });
    
    await donation.save();
    res.json(donation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};