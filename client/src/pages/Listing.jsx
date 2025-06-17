import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { useSelector } from "react-redux";
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
  const { currentUser } = useSelector((state) => state.user);
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");

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
    <div>
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
              {listing.name} - ${listing.regularPrice.toLocaleString("en-US")}
            </h1>

            <p className="flex items-center mt-2 gap-2 text-slate-600 text-sm">
              <FaMapMarkerAlt className="text-green-700" />
              <span className="underline text-green-700">
                {listing.address}
              </span>
            </p>

            <div className="flex items-center gap-4 my-4 flex-wrap">
              <p className="bg-red-900 w-fit px-3 py-1 text-white text-sm rounded-md text-center">
                {listing.type === "rent" ? "For Rent" : "For Sale"}
              </p>
              {listing.offer && (
                <p className="bg-green-900 w-fit px-3 py-1 text-white text-sm rounded-md text-center">
                  ${listing.discountPrice.toLocaleString("en-US")} discount
                </p>
              )}
            </div>

            <div className="mt-6 text-gray-700 flex-1 break-words">
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

            {currentUser && listing.userRef !== currentUser._id && (
              <div className="mt-8 flex flex-col items-center sm:items-start">
                {!showForm ? (
                  <button
                    className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 px-5 py-3 transition"
                    onClick={() => setShowForm(true)}
                  >
                    Contact Landlord
                  </button>
                ) : (
                  <div className="w-full max-w-md">
                    <p className="mb-2 font-semibold text-sm sm:text-base">
                      Contact{" "}
                      <span className="text-green-700">
                        {listing.username || "Owner"}
                      </span>{" "}
                      about{" "}
                      <span className="text-slate-800">{listing.name}</span>
                    </p>

                    <textarea
                      rows="4"
                      placeholder="Write your message here..."
                      className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-slate-700 resize-none"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    ></textarea>

                    <a
                      href={`mailto:${listing.ownerEmail}?subject=Regarding ${
                        listing.name
                      }&body=${encodeURIComponent(message)}`}
                      className={`bg-green-700 text-white rounded-lg uppercase hover:opacity-90 px-5 py-2 w-full transition text-center block ${
                        message.trim() === ""
                          ? "pointer-events-none opacity-50"
                          : ""
                      }`}
                    >
                      Send Email
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Listing;
