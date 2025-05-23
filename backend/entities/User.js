import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: function() {
    // Only require password if googleId is not provided
    return !this.googleId;
  } },
  googleId: { type: String, unique: true, sparse: true },
  profilePicture: { type: String },
  isAdmin: { type: Boolean, default: false }, // Add admin field
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password") && this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

export default mongoose.model("User", userSchema);