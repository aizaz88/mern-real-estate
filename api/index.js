import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import uploadRouter from "./routes/upload.route.js";
import listingRouter from "./routes/listing.route.js";

dotenv.config();

const app = express();

// ✅ Use CORS to allow frontend (Vercel) to call backend (Vercel)
app.use(
  cors({
    origin: "https://mern-real-estate-frontend-two.vercel.app", // ✅ Your frontend URL on Vercel
    credentials: true,
  })
);

// ✅ Parse JSON and cookies
app.use(express.json());
app.use(cookieParser());

// ✅ Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 15000, // Wait max 15s for DB server
    connectTimeoutMS: 10000, // Wait max 10s for initial connection
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });

// ✅ Basic root route to check API is alive
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ✅ All API routes
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/listing", listingRouter);

// ✅ Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// ✅ Start the server (local only)
const PORT = process.env.PORT || 5000;

// 🟢 Only listen if NOT on Vercel serverless (optional safety for deployment)
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

export default app; // ✅ For Vercel serverless to handle it
