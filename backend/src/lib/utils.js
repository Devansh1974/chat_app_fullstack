import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("CRITICAL: JWT_SECRET is not defined in environment variables!");
  }

  const token = jwt.sign({ userId }, secret || "dev_jwt_secret_fallback_key", {
    expiresIn: "7d",
  });

  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in MS
    httpOnly: true, // prevent XSS
    sameSite: isProduction ? "none" : "lax", // Allows cross-domain cookies in production (e.g. Vercel + Render)
    secure: isProduction, // Required when sameSite is "none"
  });

  return token;
};
