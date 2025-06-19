// pages/Search.jsx
import React, { useEffect, useState } from "react";
import ListingCard from "../componenets/ListingCard";
import { useLocation, useNavigate } from "react-router-dom";

export default function Search() {
  const navigate = useNavigate();
  const location = useLocation();

  // Sidebar filter state
  const [sidebardata, setSidebardata] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "createdAt",
    order: "desc",
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showCount, setShowCount] = useState(9); // Display first 9 by default

  // Fetch listings on URL change
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);

    const fetchListings = async () => {
      try {
        setLoading(true);

        // Extract query values
        const searchTermFromUrl = urlParams.get("searchTerm");
        const typeFromUrl = urlParams.get("type");
        const parkingFromUrl = urlParams.get("parking");
        const furnishedFromUrl = urlParams.get("furnished");
        const offerFromUrl = urlParams.get("offer");
        const sortFromUrl = urlParams.get("sort");
        const orderFromUrl = urlParams.get("order");

        // Update sidebar state based on URL
        setSidebardata({
          searchTerm: searchTermFromUrl || "",
          type: typeFromUrl || "all",
          parking: parkingFromUrl === "true",
          furnished: furnishedFromUrl === "true",
          offer: offerFromUrl === "true",
          sort: sortFromUrl || "createdAt",
          order: orderFromUrl || "desc",
        });

        const res = await fetch(`/api/listing/get?${urlParams.toString()}`);
        const data = await res.json();
        setListings(data);
        setShowCount(9); // Reset when new search
      } catch (err) {
        console.error("Failed to fetch listings", err);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [location.search]);

  // Handle sidebar input changes
  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    if (["all", "rent", "sale"].includes(id)) {
      setSidebardata({ ...sidebardata, type: id });
    }
    if (id === "searchTerm") {
      setSidebardata({ ...sidebardata, searchTerm: value });
    }
    if (["parking", "furnished", "offer"].includes(id)) {
      setSidebardata({ ...sidebardata, [id]: checked });
    }
    if (id === "sort_order") {
      const [sort, order] = value.split("_");
      setSidebardata({ ...sidebardata, sort, order });
    }
  };

  // Handle form submit: push URL query params
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebardata.searchTerm);
    urlParams.set("type", sidebardata.type);
    urlParams.set("parking", sidebardata.parking);
    urlParams.set("furnished", sidebardata.furnished);
    urlParams.set("offer", sidebardata.offer);
    urlParams.set("sort", sidebardata.sort);
    urlParams.set("order", sidebardata.order);
    navigate(`/search?${urlParams.toString()}`);
  };

  // Show more button logic
  const handleShowMore = () => {
    setShowCount((prev) => prev + 9);
  };

  return (
    <div className="p-4 max-w-7xl mx-auto flex flex-col md:flex-row gap-6 bg-gray-50 min-h-screen">
      {/* Sidebar */}
      <div className="md:w-[260px] w-full bg-gray-50 p-1 sm:p-3">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            id="searchTerm"
            placeholder="Search Term"
            className="border p-2 rounded w-full text-sm focus:outline-slate-500"
            value={sidebardata.searchTerm}
            onChange={handleChange}
          />
          <div>
            <label className="font-semibold text-sm">Type:</label>
            <div className="flex flex-col mt-1 space-y-1 text-sm">
              {["all", "rent", "sale"].map((typeOption) => (
                <label key={typeOption}>
                  <input
                    type="checkbox"
                    id={typeOption}
                    className="mr-1"
                    checked={sidebardata.type === typeOption}
                    onChange={handleChange}
                  />
                  {typeOption === "all"
                    ? "Rent & Sale"
                    : typeOption.charAt(0).toUpperCase() + typeOption.slice(1)}
                </label>
              ))}
              <label>
                <input
                  type="checkbox"
                  id="offer"
                  className="mr-1"
                  checked={sidebardata.offer}
                  onChange={handleChange}
                />
                Offer
              </label>
            </div>
          </div>
          <div>
            <label className="font-semibold text-sm">Amenities:</label>
            <div className="flex flex-col mt-1 space-y-1 text-sm">
              <label>
                <input
                  type="checkbox"
                  id="parking"
                  className="mr-1"
                  checked={sidebardata.parking}
                  onChange={handleChange}
                />
                Parking
              </label>
              <label>
                <input
                  type="checkbox"
                  id="furnished"
                  className="mr-1"
                  checked={sidebardata.furnished}
                  onChange={handleChange}
                />
                Furnished
              </label>
            </div>
          </div>
          <div>
            <label className="font-semibold text-sm">Sort:</label>
            <select
              id="sort_order"
              onChange={handleChange}
              value={`${sidebardata.sort}_${sidebardata.order}`}
              className="border rounded p-2 mt-1 w-full text-sm focus:outline-slate-500"
            >
              <option value="createdAt_desc">Latest</option>
              <option value="regularPrice_asc">Price Low to High</option>
              <option value="regularPrice_desc">Price High to Low</option>
              <option value="createdAt_asc">Oldest</option>
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
        {loading ? (
          <p>Loading listings...</p>
        ) : listings.length === 0 ? (
          <p className="text-sm text-gray-600">No listings found</p>
        ) : (
          <>
            <div className="flex flex-wrap gap-6">
              {listings.slice(0, showCount).map((listing) => (
                <ListingCard key={listing._id} listing={listing} />
              ))}
            </div>
            {showCount < listings.length && (
              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleShowMore}
                  className="px-4 py-2 bg-slate-700 text-white rounded hover:opacity-90"
                >
                  Show More
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
