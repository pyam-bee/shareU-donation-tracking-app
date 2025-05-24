import User from "../entities/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import dotenv from 'dotenv';

dotenv.config();

// Initialize Google OAuth client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

console.log(process.env.GOOGLE_CLIENT_ID)

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    console.log(existingUser)
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const user = new User({ name, email, password });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    console.log(user)
    console.log(await bcrypt.compare(password, user.password))
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        email: user.email, 
        name: user.name,
        isAdmin: user.isAdmin || false // Include admin status
      } 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const googleSignIn = async (req, res) => {
  try {
    const { token } = req.body;
    
    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;
    
    // Check if user exists with this email
    let user = await User.findOne({ email });
    
    if (user) {
      // If user exists but doesn't have googleId set
      if (!user.googleId) {
        user.googleId = googleId;
        if (picture) {
          user.profilePicture = picture;
        }
        await user.save();
      }
    } else {
      // Create new user if they don't exist
      user = new User({
        name,
        email,
        googleId,
        profilePicture: picture,
        isAdmin: false // Default to false for Google sign-ins
      });
      await user.save();
    }
    
    // Generate JWT token
    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    
    // Return token and user info
    res.json({
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        isAdmin: user.isAdmin || false // Include admin status
      }
    });
  } catch (error) {
    console.error("Google sign-in error:", error);
    res.status(500).json({ message: "Failed to authenticate with Google" });
  }
};

// Admin-only login endpoint
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if it's the specific admin credentials
    if (email !== 'admin@gmail.com' || password !== 'admin123') {
      return res.status(401).json({ message: "Access denied. Admin credentials required." });
    }
    
    // Check if admin user exists in database
    let user = await User.findOne({ email: 'admin@gmail.com' });
    
    if (!user) {
      // Create admin user if doesn't exist
      user = new User({
        name: 'Admin',
        email: 'admin@gmail.com',
        password: 'admin123',
        isAdmin: true
      });
      await user.save();
    } else {
      // Verify password for existing admin
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid admin credentials" });
      }
      
      // Ensure admin flag is set
      if (!user.isAdmin) {
        user.isAdmin = true;
        await user.save();
      }
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        email: user.email, 
        name: user.name,
        isAdmin: user.isAdmin
      } 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // Exclude password field
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

// Disable/Enable user (admin only)
export const disableUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Toggle user status (assuming you add an 'isActive' field to your User model)
    user.isActive = !user.isActive;
    await user.save();
    
    res.json({ 
      message: `User ${user.isActive ? 'enabled' : 'disabled'} successfully`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ message: 'Failed to update user status' });
  }
};

// Update user (admin only)
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Remove sensitive fields that shouldn't be updated via this route
    delete updates.password;
    delete updates._id;
    delete updates.__v;
    
    const user = await User.findByIdAndUpdate(
      id, 
      updates, 
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Failed to update user' });
  }
};