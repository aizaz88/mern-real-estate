import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";
import User from "../models/user.model.js";
export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json({ success: true, data: listing });
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, "listing not found !"));
  }

  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "you can only delete your own listings "));
  }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("Listing is deleted");
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, "Listing not found"));
    }
    if (req.user.id !== listing.userRef.toString()) {
      return next(errorHandler(401, "You can only update your own listing"));
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json({ success: true, data: updatedListing });
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, "Listing not found"));
    }

    let ownerEmail = "";
    let username = "";

    try {
      const user = await User.findById(listing.userRef).select(
        "email username"
      );
      if (user) {
        ownerEmail = user.email;
        username = user.username;
      }
    } catch (err) {
      console.warn(
        "⚠️ Failed to fetch user info for listing owner:",
        err.message
      );
      // Proceed without crashing — no email will be included
    }

    // Send extended data
    res.status(200).json({
      ...listing._doc, // original listing data
      ownerEmail,
      username,
    });
  } catch (error) {
    next(error);
  }
};
