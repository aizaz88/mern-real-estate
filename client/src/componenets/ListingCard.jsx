// components/ListingCard.jsx
import { Link } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";

export default function ListingCard({ listing }) {
  return (
    <div className="border rounded-lg shadow-md overflow-hidden transition hover:shadow-lg w-full sm:w-[300px]">
      <Link to={`/listing/${listing._id}`}>
        <img
          src={listing.imageUrls[0]}
          alt={listing.name}
          className="h-52 w-full object-cover"
        />
        <div className="p-4">
          <h2 className="text-lg font-semibold truncate">{listing.name}</h2>
          <p className="text-gray-500 flex items-center text-sm my-1">
            <FaMapMarkerAlt className="mr-1" />
            {listing.address}
          </p>
          <p className="text-sm text-gray-600 truncate">
            {listing.description}
          </p>
          <p className="font-semibold mt-2 text-blue-600">
            ${listing.regularPrice}{" "}
            <span className="text-sm font-normal text-gray-500">
              {listing.type === "rent" ? "/ month" : ""}
            </span>
          </p>
          <div className="flex justify-between text-xs text-gray-600 mt-2">
            <p>{listing.bedrooms} Beds</p>
            <p>{listing.bathrooms} Baths</p>
          </div>
        </div>
      </Link>
    </div>
  );
}
