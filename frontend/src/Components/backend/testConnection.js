const mongoose = require('mongoose');

const MONGO_URI = "mongodb://localhost:27017/donation_users";

const testConnection = async () => {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB successfully');
    mongoose.connection.close();
  } catch (err) {
    console.error('Connection failed:', err.message);
  }
};

testConnection();
 