import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import uploadRouter from "./routes/upload.route.js";
import cookieParser from "cookie-parser";
const app = express();
app.use(express.json());
app.use(cookieParser());
dotenv.config();
//////////////////
//Mongo connect -----

mongoose
  .connect(process.env.MONGO)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));
//////////////////////////////////////////

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/upload", uploadRouter);

/////////////////////
//MiddleWare (error)
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
//////////////////////////
app.listen(5000, () => {
  console.log("server is listening on port 5000!!");
});
