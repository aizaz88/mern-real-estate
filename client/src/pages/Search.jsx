// pages/Search.jsx
import React from "react";
import ListingCard from "../componenets/ListingCard";

const dummyListing = {
  _id: "1",
  name: "Ultra-Modern Penthouse in Meadowville",
  address: "456 Serenity Lane, Meadowville",
  description:
    "Elevate your living experience in this state-of-the-art penthouse with futuristic design...",
  regularPrice: 500,
  bathrooms: 5,
  bedrooms: 6,
  type: "rent",
  imageUrls: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c"],
};

export default function Search() {
  return (
    <div className="p-4 max-w-7xl mx-auto flex flex-col md:flex-row gap-6 bg-gray-50 min-h-screen">
      {/* Sidebar Search Filter */}
      <div className="md:w-[260px] w-full bg-gray-50 p-1 sm:p-3">
        <form className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Search Term"
            className="border p-2 rounded w-full text-sm focus:outline-slate-500"
          />
          <div>
            <label className="font-semibold text-sm">Type:</label>
            <div className="flex flex-col mt-1 space-y-1 text-sm">
              <label>
                <input type="checkbox" defaultChecked className="mr-1" /> Rent &
                Sale
              </label>
              <label>
                <input type="checkbox" className="mr-1" /> Rent
              </label>
              <label>
                <input type="checkbox" className="mr-1" /> Sale
              </label>
              <label>
                <input type="checkbox" className="mr-1" /> Offer
              </label>
            </div>
          </div>
          <div>
            <label className="font-semibold text-sm">Amenities:</label>
            <div className="flex flex-col mt-1 space-y-1 text-sm">
              <label>
                <input type="checkbox" className="mr-1" /> Parking
              </label>
              <label>
                <input type="checkbox" className="mr-1" /> Furnished
              </label>
            </div>
          </div>
          <div>
            <label className="font-semibold text-sm">Sort:</label>
            <select className="border rounded p-2 mt-1 w-full text-sm focus:outline-slate-500">
              <option>Latest</option>
              <option>Price high to low</option>
              <option>Price low to high</option>
              <option>Oldest</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-slate-700 text-white rounded-lg py-2 text-sm uppercase hover:opacity-90"
          >
            Search
          </button>
        </form>
      </div>

      {/* Listing Results */}
      <div className="flex-1">
        <h2 className="text-xl font-semibold mb-4">Listing results:</h2>
        <div className="flex flex-wrap gap-6">
          {/* Dummy listing card */}
          <ListingCard listing={dummyListing} />
        </div>
      </div>
    </div>
  );
}
