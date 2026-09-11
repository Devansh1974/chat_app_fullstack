import prisma from "../lib/prisma.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user.id || req.user._id;
    const users = await prisma.user.findMany({
      where: {
        id: { not: loggedInUserId },
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        profilePic: true,
        createdAt: true,
      },
    });

    const formattedUsers = users.map((u) => ({
      ...u,
      _id: u.id,
    }));

    res.status(200).json(formattedUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user.id || req.user._id;

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: myId, receiverId: userToChatId },
          { senderId: userToChatId, receiverId: myId },
        ],
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const formattedMessages = messages.map((m) => ({
      ...m,
      _id: m.id,
    }));

    res.status(200).json(formattedMessages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user.id || req.user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = await prisma.message.create({
      data: {
        senderId,
        receiverId,
        text,
        image: imageUrl,
      },
    });

    const formattedMessage = {
      ...newMessage,
      _id: newMessage.id,
    };

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", formattedMessage);
    }

    res.status(201).json(formattedMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
