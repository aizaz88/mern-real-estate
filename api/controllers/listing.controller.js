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

//GET litings for the edit system
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

//GET listing for search functionality
export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;

    //-------------
    let offer = req.query.offer;
    if (offer === undefined || offer === "false") {
      offer = { $in: [false, true] };
    }
    //------------
    let furnished = req.query.furnished;
    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [false, true] };
    }
    //-----------------
    let parking = req.query.parking;
    if (parking === undefined || parking === "false") {
      parking = { $in: [false, true] };
    }
    //-----------
    let type = req.query.type;
    if (type === undefined || type === "all") {
      type = { $in: ["sale", "rent"] };
    }
    //---------------
    const searchTerm = req.query.searchTerm || "";
    const sort = req.query.sort || "createdAt";
    const order = req.query.order || "dec";
    const sortOrder = order === "asc" ? 1 : -1;
    //-----------

    //MONGODB search
    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: sortOrder })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
