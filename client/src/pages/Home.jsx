import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import "swiper/css/navigation";
import "swiper/css";
import ListingCard from "../componenets/ListingCard";

function Home() {
  SwiperCore.use([Navigation]);
  const [offerListings, setOfferListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);

  ///////////////////////////
  //USE EFFECT to fetch the data
  useEffect(() => {
    //Fetch OFFER Listing
    const fetchOfferListings = async () => {
      try {
        const res = await fetch(
          "https://mern-real-estate-backend-nine.vercel.app/api/listing/get?offer=true&limit=4"
        );
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error.message);
      }
    };

    //Fetch RENT listings
    const fetchRentListings = async () => {
      try {
        const res = await fetch(
          "https://mern-real-estate-backend-nine.vercel.app/api/listing/get?type=rent&limit=4"
        );
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error.message);
      }
    };

    //Fetch SALE listings
    const fetchSaleListings = async () => {
      try {
        const res = await fetch(
          "https://mern-real-estate-backend-nine.vercel.app/api/listing/get?type=sale&limit=4"
        );
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error.message);
      }
    };
    //////////////////////////////////////////////////
    fetchOfferListings();
  }, []);
  return (
    <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
      <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
        Find your next <span className="text-slate-500">perfect</span>
        <br />
        place with ease
      </h1>
      <div className="text-slate-400 text-xs sm:text-sm">
        AU-Estate is the best place to find your next perfect place to live{" "}
        <br /> We have a wide range of properties for you to choose from
      </div>
      <Link
        to={"/search"}
        className="text-xs sm:text-sm text-blue-600 font-bold hover:underline"
      >
        Let's get started
      </Link>
      {offerListings.length > 0 && (
        <div className="w-full">
          <h2 className="text-xl font-semibold text-slate-700 mb-2">
            Special Offers
          </h2>
          <Swiper
            navigation
            modules={[Navigation]}
            className="rounded-lg"
            slidesPerView={1}
            spaceBetween={20}
          >
            {offerListings.map((listing) => (
              <SwiperSlide key={listing._id}>
                <div
                  className="h-[300px] sm:h-[400px] lg:h-[500px] w-full rounded-xl shadow-lg"
                  style={{
                    background: `url(${
                      listing.imageUrls?.[0] || "/placeholder.jpg"
                    }) center center / cover no-repeat`,
                  }}
                >
                  {/* Optional Overlay or Text */}
                  <div className="bg-black/50 h-full flex items-end justify-start p-4 rounded-xl text-white">
                    <div>
                      <h3 className="text-lg font-bold">{listing.name}</h3>
                      <p className="text-sm">{listing.address}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {/* //-----Listings for rent sale and offer*/}
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {offerListings && offerListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent Offers
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={"/search?offer=true"}
              >
                show more offers
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {offerListings.map((listing) => (
                <ListingCard listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent places for Rents
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={"/search?type=rent"}
              >
                show more places for rents
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {rentListings.map((listing) => (
                <ListingCard listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {saleListings && saleListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent places for Sales
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={"/search?type=sale"}
              >
                show more places for sales
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {saleListings.map((listing) => (
                <ListingCard listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default Home;
