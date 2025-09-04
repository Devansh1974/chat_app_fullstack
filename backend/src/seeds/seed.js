import { config } from "dotenv";
import bcrypt from "bcryptjs";
import { connectDB } from "../lib/db.js";
import User from "../models/user.model.js";

config();

const seedUsers = [
  // Female Users
  {
    email: "priya@example.com",
    fullName: "Priya Sharma",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/1.jpg",
  },

  {
    email: "sneha@example.com",
    fullName: "Sneha Patel",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/3.jpg",
  },
  {
    email: "rohan@example.com",
    fullName: "Rohan",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    email: "kavya@example.com",
    fullName: "Kavya Reddy",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/6.jpg",
  },
  {
    email: "pooja@example.com",
    fullName: "Pooja Mehta",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/5.jpg",
  },

  // Male Users

  {
    email: "vikram@example.com",
    fullName: "Vikram Rathore",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/2.jpg",
  },

  {
    email: "karan@example.com",
    fullName: "Karan Malhotra",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/4.jpg",
  },
  {
    email: "Daniel@example.com",
    fullName: "Daniel Rodriguez",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/7.jpg",
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();
    // ‼️ IMPORTANT: Clear existing users to prevent duplicates
    await User.deleteMany({});
    console.log("Cleared existing users.");

    // ✨ FIX: Hash passwords before inserting users
    const salt = await bcrypt.genSalt(10);
    const usersWithHashedPasswords = await Promise.all(
      seedUsers.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, salt);
        return { ...user, password: hashedPassword };
      })
    );

    await User.insertMany(usersWithHashedPasswords);
    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    // Optional: Close the connection after seeding
    // mongoose.connection.close();
  }
};

// Call the function
seedDatabase();