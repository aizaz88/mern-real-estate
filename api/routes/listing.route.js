import {
  createListing,
  deleteListing,
  updateListing,
} from "../controllers/listing.controller.js";
import express from "express";
import { verifyUser } from "../utils/verifyUser.js";

const router = express.Router();
router.post("/create", verifyUser, createListing);
router.delete("/delete/:id", verifyUser, deleteListing);
router.delete("/update/:id", verifyUser, updateListing);

export default router;
