import React, { useEffect, useState } from "react";
import ListingCard from "../componenets/ListingCard";
import { useLocation, useNavigate } from "react-router-dom";

export default function Search() {
  const navigate = useNavigate();
  const location = useLocation(); // get current URL and query string

  // Sidebar filters and sort options
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

  // Fetch listings based on URL query params
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);

    // Extract query params
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    // Set extracted values into sidebar state
    setSidebardata({
      searchTerm: searchTermFromUrl || "",
      type: typeFromUrl || "all",
      parking: parkingFromUrl === "true",
      furnished: furnishedFromUrl === "true",
      offer: offerFromUrl === "true",
      sort: sortFromUrl || "createdAt",
      order: orderFromUrl || "desc",
    });

    // Fetch listings from backend
    const fetchListings = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get?${urlParams.toString()}`);
        const data = await res.json();
        setListings(data);
      } catch (error) {
        console.error("Failed to fetch listings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [location.search]);

  // Handle changes in filter/sort fields
  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;

    // Handle type selection (rent, sale, all)
    if (["all", "rent", "sale"].includes(id)) {
      setSidebardata({ ...sidebardata, type: id });
    }

    // Handle text input
    if (id === "searchTerm") {
      setSidebardata({ ...sidebardata, searchTerm: value });
    }

    // Handle checkboxes (parking, furnished, offer)
    if (["parking", "furnished", "offer"].includes(id)) {
      setSidebardata({ ...sidebardata, [id]: checked });
    }

    // Handle sort dropdown
    if (id === "sort_order") {
      const [sort, order] = value.split("_");
      setSidebardata({ ...sidebardata, sort, order });
    }
  };

  // When user submits the search form
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();

    // Set URL query parameters from state
    urlParams.set("searchTerm", sidebardata.searchTerm);
    urlParams.set("type", sidebardata.type);
    urlParams.set("parking", sidebardata.parking);
    urlParams.set("furnished", sidebardata.furnished);
    urlParams.set("offer", sidebardata.offer);
    urlParams.set("sort", sidebardata.sort);
    urlParams.set("order", sidebardata.order);

    // Update the URL and trigger useEffect
    navigate(`/search?${urlParams.toString()}`);
  };

  return (
    <div className="p-4 max-w-7xl mx-auto flex flex-col md:flex-row gap-6 bg-gray-50 min-h-screen">
      {/* --- Sidebar (Search Filter Form) --- */}
      <div className="md:w-[260px] w-full bg-gray-50 p-1 sm:p-3">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Search Text Field */}
          <input
            type="text"
            id="searchTerm"
            placeholder="Search Term"
            className="border p-2 rounded w-full text-sm focus:outline-slate-500"
            value={sidebardata.searchTerm}
            onChange={handleChange}
          />

          {/* Property Type */}
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
                />{" "}
                Offer
              </label>
            </div>
          </div>

          {/* Amenities */}
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
                />{" "}
                Parking
              </label>
              <label>
                <input
                  type="checkbox"
                  id="furnished"
                  className="mr-1"
                  checked={sidebardata.furnished}
                  onChange={handleChange}
                />{" "}
                Furnished
              </label>
            </div>
          </div>

          {/* Sort Options */}
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

          {/* Search Button */}
          <button
            type="submit"
            className="bg-slate-700 text-white rounded-lg py-2 text-sm uppercase hover:opacity-90"
          >
            Search
          </button>
        </form>
      </div>

      {/* --- Right Panel (Listing Results) --- */}
      <div className="flex-1">
        <h2 className="text-xl font-semibold mb-4">Listing results:</h2>

        {loading ? (
          <p>Loading listings...</p>
        ) : listings.length === 0 ? (
          <p className="text-sm text-gray-600">No listings found</p>
        ) : (
          <div className="flex flex-wrap gap-6">
            {listings.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
