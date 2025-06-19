import { Link } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";

export default function ListingCard({ listing }) {
  const hasOffer = listing.offer;
  const regularPrice = listing.regularPrice;
  const discountAmount = listing.discountPrice;
  const finalPrice = hasOffer ? regularPrice - discountAmount : regularPrice;

  return (
    <div className="border rounded-2xl shadow-md overflow-hidden transition hover:shadow-xl w-full sm:w-[230px] bg-white">
      <Link to={`/listing/${listing._id}`}>
        {/* Image */}
        <img
          src={listing.imageUrls[0]}
          alt={listing.name}
          className="h-44 w-full object-cover"
        />

        {/* Content */}
        <div className="p-3 flex flex-col gap-2">
          {/* Title */}
          <h2 className="text-base font-semibold text-slate-800 truncate">
            {listing.name}
          </h2>

          {/* Address */}
          <p className="text-gray-500 flex items-center text-xs truncate">
            <FaMapMarkerAlt className="mr-1 text-green-500" />
            {listing.address}
          </p>

          {/* Description */}
          <p className="text-xs text-gray-600 truncate">
            {listing.description}
          </p>

          {/* Pricing */}
          <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-1">
            {hasOffer && (
              <span className="bg-red-100 text-red-600 text-xs line-through px-2 py-1 rounded-full w-fit">
                ${regularPrice}
              </span>
            )}
            <span className="bg-green-100 text-green-700 text-sm font-semibold px-2 py-1 rounded-full w-fit">
              ${finalPrice}
              {listing.type === "rent" && <span> / month</span>}
            </span>
          </div>

          {/* Discount */}
          {hasOffer && (
            <p className="text-xs text-green-600 font-medium mt-1">
              You save <span className="font-bold">${discountAmount}</span>
            </p>
          )}

          {/* Beds & Baths */}
          <div className="flex justify-between text-xs text-slate-700 mt-2 font-medium">
            <p>{listing.bedrooms} Beds</p>
            <p>{listing.bathrooms} Baths</p>
          </div>
        </div>
      </Link>
    </div>
  );
}
