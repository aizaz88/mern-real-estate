import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";

const app = express();
app.use(express.json());
//////////////////
//Mongo connect -----
dotenv.config();
mongoose
  .connect(process.env.MONGO)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));
//////////////////////////////////////////

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

//////////////////////////
app.listen(5000, () => {
  console.log("server is listening on port 5000!!");
});
