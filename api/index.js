import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
<<<<<<< HEAD
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";

const app = express();
app.use(express.json());
=======
import userRouter from "./routes/user.router.js";
const app = express();
>>>>>>> e3caff93a8fc1bfdad0800c7dd9e0a1046cdf88a
//////////////////
//Mongo connect -----
dotenv.config();
mongoose
  .connect(process.env.MONGO)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));
//////////////////////////////////////////

app.use("/api/user", userRouter);
<<<<<<< HEAD
app.use("/api/auth", authRouter);
=======
>>>>>>> e3caff93a8fc1bfdad0800c7dd9e0a1046cdf88a

//////////////////////////
app.listen(5000, () => {
  console.log("server is listening on port 5000!!");
});
