import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import {
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaParking,
  FaChair,
} from "react-icons/fa";

function Listing() {
  SwiperCore.use([Navigation]);
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();

        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }

        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  return (
    <div className="">
      {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
      {error && (
        <p className="text-red-500 text-center my-7 text-2xl">
          Something went wrong
        </p>
      )}

      {listing && !loading && !error && (
        <div>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[450px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="max-w-4xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-semibold text-black mb-2">
              {listing.name} - $ {listing.regularPrice.toLocaleString("en-US")}
            </h1>

            <p className="flex items-center mt-2 gap-2 text-slate-600 text-sm">
              <FaMapMarkerAlt className="text-green-700" />
              <span className="underline text-green-700">
                {listing.address}
              </span>
            </p>

            <div className="flex items-center gap-4 my-4">
              {/* For Sale / For Rent pill */}
              <p className="bg-red-900 w-fit px-3 py-1 text-white text-sm rounded-md text-center">
                {listing.type === "rent" ? "For Rent" : "For Sale"}
              </p>

              {/* ✅ Show discounted price if offer is true */}
              {listing.offer && (
                <p className="bg-green-900 w-fit px-3 py-1 text-white text-sm rounded-md text-center">
                  ${listing.discountPrice.toLocaleString("en-US")} discount
                </p>
              )}
            </div>

            <div className="mt-6 text-gray-700">
              <p>
                <span className="font-semibold text-black">Description - </span>
                {listing.description}
              </p>
            </div>

            <ul className="text-sm flex flex-wrap gap-4 mt-6 text-green-900 font-semibold">
              <li className="flex items-center gap-1">
                <FaBed /> {listing.bedrooms} Beds
              </li>
              <li className="flex items-center gap-1">
                <FaBath /> {listing.bathrooms} Baths
              </li>
              <li className="flex items-center gap-1">
                <FaParking /> {listing.parking ? "Parking spot" : "No parking"}
              </li>
              <li className="flex items-center gap-1">
                <FaChair /> {listing.furnished ? "Furnished" : "Not furnished"}
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default Listing;
