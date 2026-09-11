import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import prisma from "./lib/prisma.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

// Increased payload size limit for image uploads
app.use(express.json({ limit: "10mb" }));

app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, same-origin static frontend, etc.)
      if (!origin) return callback(null, true);
      if (allowedOrigins.length === 0 || allowedOrigins.includes(origin) || process.env.NODE_ENV !== "production") {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// Diagnostic Health Check Route
app.get("/api/health", async (req, res) => {
  let dbStatus = "connected";
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (err) {
    dbStatus = `disconnected (${err.message})`;
  }

  res.status(200).json({
    status: "ok",
    database: "postgresql",
    databaseStatus: dbStatus,
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

server.listen(PORT, async () => {
  console.log(`Server is running on PORT: ${PORT}`);
  try {
    await prisma.$connect();
    console.log("PostgreSQL connected successfully via Prisma!");
  } catch (err) {
    console.error("PostgreSQL connection error:", err.message);
  }
});
