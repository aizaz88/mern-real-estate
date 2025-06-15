import React from "react";

export default function CreateListing() {
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <form className="flex flex-col sm:flex-row gap-6">
        {/* Left Section */}
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg bg-white"
            id="name"
            maxLength="62"
            minLength="10"
            required
          />
          <textarea
            placeholder="Description"
            className="border p-3 rounded-lg bg-white"
            id="description"
            required
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg bg-white"
            id="address"
            required
          />

          <div className="flex gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <input type="checkbox" id="sell" className="w-5 h-5" />
              <label htmlFor="sell">Sell</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="rent" className="w-5 h-5" />
              <label htmlFor="rent">Rent</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="parking" className="w-5 h-5" />
              <label htmlFor="parking">Parking spot</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="furnished" className="w-5 h-5" />
              <label htmlFor="furnished">Furnished</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="offer" className="w-5 h-5" />
              <label htmlFor="offer">Offer</label>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex flex-col">
              <input
                type="number"
                id="beds"
                min="1"
                max="10"
                defaultValue={1}
                required
                className="border p-3 rounded-lg bg-white"
              />
              <label htmlFor="beds" className="text-sm mt-1">
                Beds
              </label>
            </div>
            <div className="flex flex-col">
              <input
                type="number"
                id="baths"
                min="1"
                max="10"
                defaultValue={1}
                required
                className="border p-3 rounded-lg bg-white"
              />
              <label htmlFor="baths" className="text-sm mt-1">
                Baths
              </label>
            </div>
          </div>

          <div className="flex flex-col">
            <input
              type="number"
              id="regularPrice"
              min="0"
              defaultValue={0}
              required
              className="border p-3 rounded-lg bg-white"
            />
            <label htmlFor="regularPrice" className="text-sm mt-1">
              Regular price <span className="text-gray-500">($ / Month)</span>
            </label>
          </div>

          <div className="flex flex-col">
            <input
              type="number"
              id="discountedPrice"
              min="0"
              defaultValue={0}
              className="border p-3 rounded-lg bg-white"
            />
            <label htmlFor="discountedPrice" className="text-sm mt-1">
              Discounted price{" "}
              <span className="text-gray-500">($ / Month)</span>
            </label>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex flex-col gap-4 flex-1">
          <p className="font-semibold">
            Images:{" "}
            <span className="font-normal text-gray-600">
              The first image will be the cover (max 6)
            </span>
          </p>

          <div className="flex items-center gap-2">
            <input
              type="file"
              accept=".jpg,.png,.jpeg"
              multiple
              className="border border-gray-300 rounded px-3 py-2 w-full bg-white text-gray-700"
            />
            <button
              type="button"
              className="text-green-700 border border-green-700 px-4 py-2 rounded hover:shadow-lg"
            >
              Upload
            </button>
          </div>

          <button
            type="submit"
            className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95"
          >
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
}
