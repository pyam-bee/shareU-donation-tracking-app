import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
// import donationRoutes from "./routes/donationsRoutes.js";
import "dotenv/config";

const app = express();
const port = 4000;

// Middleware
app.use(express.json());
app.use(cors({ origin: "*" }));

// Database connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
// app.use("/api/donations", donationRoutes);
console.log(process.env.MONGO_URI)

app.listen(port, () => {
  console.log(`Server started at ${port}`);
});