import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.router.js";
const app = express();
//////////////////
//Mongo connect -----
dotenv.config();
mongoose
  .connect(process.env.MONGO)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));
//////////////////////////////////////////

app.use("/api/user", userRouter);

//////////////////////////
app.listen(5000, () => {
  console.log("server is listening on port 5000!!");
});
