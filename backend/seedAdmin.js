import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/db.js"; // adjust path if needed
import User from "./models/User.js";
import { hashPassword } from "./utils/bcrypt.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    // Check if admin already exists
    const adminExists = await User.findOne({ email: "admin@example.com" });
    if (adminExists) {
      console.log("✅ Admin already exists");
      process.exit();
    }

    // Create admin user
    const hashedPassword = await hashPassword("Admin@123"); 
    const adminUser = await User.create({
      fullName: "Admin User",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin",
    });

    console.log("✅ Admin user created successfully:", adminUser);
    process.exit();
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    process.exit(1);
  }
};

seedAdmin();
