import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import "dotenv/config";
import donationRoutes from "./routes/donationsRoutes.js"

const app = express();
const port = process.env.PORT || 4000;

// Get current directory (ES modules replacement for __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors({ origin: "*" }));

// Database connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

// Campaign data file setup
const dataDir = path.join(__dirname, 'data');
const dataFilePath = path.join(dataDir, 'campaigns.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize data file if it doesn't exist
if (!fs.existsSync(dataFilePath)) {
  fs.writeFileSync(dataFilePath, JSON.stringify([]), 'utf8');
}

// Helper function to read campaign data
const readCampaignData = () => {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading campaign data:', error);
    return [];
  }
};

// Helper function to write campaign data
const writeCampaignData = (data) => {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing campaign data:', error);
    return false;
  }
};

// Campaign Routes
// GET all campaigns
app.get('/api/campaigns', (req, res) => {
  const campaigns = readCampaignData();
  res.json(campaigns);
});

// GET campaign by ID
app.get('/api/campaigns/:id', (req, res) => {
  const campaigns = readCampaignData();
  const campaign = campaigns.find(c => c.id === req.params.id);
  
  if (!campaign) {
    return res.status(404).json({ message: 'Campaign not found' });
  }
  
  res.json(campaign);
});

// POST new campaign
app.post('/api/campaigns', (req, res) => {
  const campaigns = readCampaignData();
  const newCampaign = req.body;
  
  // Validate required fields
  if (!newCampaign.title || !newCampaign.goalAmount) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  
  // Ensure ID is unique
  if (!newCampaign.id) {
    newCampaign.id = Date.now().toString();
  } else if (campaigns.some(c => c.id === newCampaign.id)) {
    return res.status(400).json({ message: 'Campaign ID already exists' });
  }
  
  campaigns.push(newCampaign);
  
  if (writeCampaignData(campaigns)) {
    res.status(201).json(newCampaign);
  } else {
    res.status(500).json({ message: 'Failed to save campaign' });
  }
});

// PUT (update) campaign
app.put('/api/campaigns/:id', (req, res) => {
  const campaigns = readCampaignData();
  const campaignIndex = campaigns.findIndex(c => c.id === req.params.id);
  
  if (campaignIndex === -1) {
    return res.status(404).json({ message: 'Campaign not found' });
  }
  
  const updatedCampaign = req.body;
  updatedCampaign.id = req.params.id; // Ensure ID stays the same
  
  campaigns[campaignIndex] = updatedCampaign;
  
  if (writeCampaignData(campaigns)) {
    res.json(updatedCampaign);
  } else {
    res.status(500).json({ message: 'Failed to update campaign' });
  }
});

// DELETE campaign
app.delete('/api/campaigns/:id', (req, res) => {
  const campaigns = readCampaignData();
  const campaignIndex = campaigns.findIndex(c => c.id === req.params.id);
  
  if (campaignIndex === -1) {
    return res.status(404).json({ message: 'Campaign not found' });
  }
  
  campaigns.splice(campaignIndex, 1);
  
  if (writeCampaignData(campaigns)) {
    res.json({ message: 'Campaign deleted successfully' });
  } else {
    res.status(500).json({ message: 'Failed to delete campaign' });
  }
});

// Routes
app.use("/api/auth", authRoutes);
app.use('/api/donations', donationRoutes);

console.log(`MongoDB URI: ${process.env.MONGO_URI}`);

app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});

