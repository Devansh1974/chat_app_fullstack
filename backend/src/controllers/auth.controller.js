import { generateToken } from "../lib/utils.js";
import prisma from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
      },
    });

    generateToken(newUser.id, res);

    res.status(201).json({
      _id: newUser.id,
      id: newUser.id,
      fullName: newUser.fullName,
      email: newUser.email,
      profilePic: newUser.profilePic,
    });
  } catch (error) {
    console.log("Error in signup controller:", error.message);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    generateToken(user.id, res);

    res.status(200).json({
      _id: user.id,
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login controller:", error.message);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

export const guestLogin = async (req, res) => {
  try {
    const { preset } = req.body || {};

    let targetEmail = "guest@example.com";
    let targetName = "Guest Explorer";
    let targetPic = "https://randomuser.me/api/portraits/lego/1.jpg";

    if (preset === "priya") {
      targetEmail = "priya@example.com";
      targetName = "Priya Sharma";
      targetPic = "https://randomuser.me/api/portraits/women/1.jpg";
    } else if (preset === "rohan") {
      targetEmail = "rohan@example.com";
      targetName = "Rohan";
      targetPic = "https://randomuser.me/api/portraits/men/1.jpg";
    }

    let user = await prisma.user.findUnique({ where: { email: targetEmail } });

    // Auto-create guest user if not yet present
    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("123456", salt);
      user = await prisma.user.create({
        data: {
          fullName: targetName,
          email: targetEmail,
          password: hashedPassword,
          profilePic: targetPic,
        },
      });
    }

    generateToken(user.id, res);

    res.status(200).json({
      _id: user.id,
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in guestLogin controller:", error.message);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user.id || req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { profilePic: uploadResponse.secure_url },
    });

    res.status(200).json({
      ...updatedUser,
      _id: updatedUser.id,
    });
  } catch (error) {
    console.log("Error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({
      ...user,
      _id: user.id,
    });
  } catch (error) {
    console.log("Error in checkAuth controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
