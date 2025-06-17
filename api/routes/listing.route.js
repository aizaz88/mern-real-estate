import {
  createListing,
  deleteListing,
} from "../controllers/listing.controller.js";
import express from "express";
import { verifyUser } from "../utils/verifyUser.js";

const router = express.Router();
router.post("/create", verifyUser, createListing);
router.delete("/delete/:id", verifyUser, deleteListing);
export default router;
