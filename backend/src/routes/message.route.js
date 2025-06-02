import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getMessages,
  getUsersForSidebar,
  sendMessage,
} from "../controllers/message.controller.js";

const router = express.Router();

// Keep specific routes above generic ones
router.get("/users", protectRoute, getUsersForSidebar);
router.post("/send/:id", protectRoute, sendMessage);
router.get("/chat/:id", protectRoute, getMessages);  // ✅ safer route

export default router;
