import mongoose from 'mongoose';
import User from './entities/User.js'; // Adjust path to your User model
import dotenv from 'dotenv';

dotenv.config();

const setupAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/your-database-name');
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@gmail.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      // Update existing user to ensure admin status
      existingAdmin.isAdmin = true;
      await existingAdmin.save();
      console.log('Updated existing user to admin status');
    } else {
      // Create new admin user
      const adminUser = new User({
        name: 'Admin',
        email: 'admin@gmail.com',
        password: 'admin123', // This will be hashed by the pre-save hook
        isAdmin: true
      });

      await adminUser.save();
      console.log('Admin user created successfully!');
      console.log('Email: admin@gmail.com');
      console.log('Password: admin123');
    }

    // List all users for verification
    const allUsers = await User.find({}, 'name email isAdmin');
    console.log('\nAll users in database:');
    allUsers.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - Admin: ${user.isAdmin}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error setting up admin:', error);
    process.exit(1);
  }
};

setupAdmin();