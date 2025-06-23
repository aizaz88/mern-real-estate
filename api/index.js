import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors"; // ✅ Import CORS
import cookieParser from "cookie-parser";

import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import uploadRouter from "./routes/upload.route.js";
import listingRouter from "./routes/listing.route.js";

dotenv.config();

const app = express();

// ✅ Allow frontend to access backend (adjust origin as needed)
app.use(
  cors({
    origin: "https://mern-real-estate-frontend-two.vercel.app", // ✅ Frontend URL
    credentials: true, // ✅ Allow cookies if needed
  })
);

// ✅ Parse incoming JSON and cookies
app.use(express.json());
app.use(cookieParser());

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection error:", err));

// ✅ Mount API routes
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/listing", listingRouter);

// ✅ Root route check
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ✅ Global error handler middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// ✅ Start the server
app.listen(5000, () => {
  console.log("Server is listening on port 5000!!");
});
