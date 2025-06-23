import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export default function CreateListing() {
  const navigate = useNavigate();
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });

  const [imageUploadError, setImageUploadError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  //USE-EFFECT---for Listing data to update
  useEffect(() => {
    const fetchListing = async () => {
      const listingId = params.listingId;
      const res = await fetch(
        `https://mern-real-estate-backend-nine.vercel.app/api/listing/get/${listingId}`
      );
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setFormData(data);
    };
    fetchListing();
  }, []);

  ////////////////////////////////////////////////////////
  //Image storage in cloudinary--------

  const cloudName = "dc0wr37lq";
  const uploadPreset = "listing_uploads";

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);
      formData.append("cloud_name", cloudName);

      fetch(
        `https:/https://mern-real-estate-backend-nine.vercel.app/api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.secure_url) {
            resolve(data.secure_url);
          } else {
            reject(new Error("Invalid response from Cloudinary"));
          }
        })
        .catch((err) => reject(err));
    });
  };
  //////////////////////////////////////////////////////////////////
  //Upload images fetching from Cloudinary urls and then in UI
  const handleImageSubmit = async (e) => {
    e.preventDefault();
    setImageUploadError(null);

    if (files.length === 0) {
      return setImageUploadError("Please select image files first.");
    }

    if (files.length + formData.imageUrls.length > 6) {
      return setImageUploadError("You can upload a maximum of 6 images.");
    }

    setUploading(true);
    try {
      const promises = files.map((file) => storeImage(file));
      const urls = await Promise.all(promises);
      setFormData((prev) => ({
        ...prev,
        imageUrls: [...prev.imageUrls, ...urls],
      }));
      setFiles([]);
    } catch (error) {
      console.error("Image upload failed", error);
      setImageUploadError("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  ////////////////////////////////////////////////////////////////////////
  //Handle change in form data
  const handleChange = (e) => {
    const { id, type, value, checked } = e.target;

    if (id === "sale" || id === "rent") {
      setFormData((prev) => ({ ...prev, type: id }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [id]: checked }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [id]: id.includes("Price") ? Number(value) : value,
      }));
    }
  };

  /////////////////////////////////////////////////////
  ////Checking things and HANDLE SUBMIT-----------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (formData.imageUrls.length < 1)
        return setError("you must upload at least one image");
      if (formData.discountPrice >= formData.regularPrice)
        // ❗ Ensure discount price is not more than regular price
        return setError("Discounted price must be less than regular price");
      setLoading(true);
      setError(false);

      const res = await fetch(
        `https://mern-real-estate-backend-nine.vercel.app/api/listing/update/${params.listingId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            userRef: currentUser._id,
          }),
        }
      );

      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data.data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  /////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Update a Listing
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-6">
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
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            placeholder="Description"
            className="border p-3 rounded-lg bg-white"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg bg-white"
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          />

          <div className="flex gap-4 flex-wrap">
            {/* Sale */}
            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
              <span>Sell</span>
            </div>

            {/* Rent */}
            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <span>Rent</span>
            </div>

            {/* Parking Spot */}
            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking spot</span>
            </div>

            {/* Furnished */}
            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>

            {/* Offer */}
            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
            <div className="flex gap-6">
              {/* Bedrooms */}
              <div className="flex flex-col">
                <input
                  type="number"
                  id="bedrooms"
                  min="1"
                  max="10"
                  required
                  value={formData.bedrooms}
                  onChange={handleChange}
                  className="border p-3 rounded-lg bg-white"
                />
                <label htmlFor="bedrooms" className="text-sm mt-1 capitalize">
                  Bedrooms
                </label>
              </div>
            </div>
            {/* Bathrooms */}
            <div className="flex flex-col">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                value={formData.bathrooms}
                onChange={handleChange}
                className="border p-3 rounded-lg bg-white"
              />
              <label htmlFor="bathrooms" className="text-sm mt-1 capitalize">
                Bathrooms
              </label>
            </div>
          </div>

          <div className="flex flex-col">
            <input
              type="number"
              id="regularPrice"
              min="50"
              max="100000"
              required
              className="border p-3 rounded-lg bg-white"
              onChange={handleChange}
              value={formData.regularPrice}
            />
            <label htmlFor="regularPrice" className="text-sm mt-1">
              Regular price <span className="text-gray-500">($ / Month)</span>
            </label>
          </div>

          {formData.offer && (
            <div className="flex flex-col">
              <input
                type="number"
                id="discountPrice"
                min="0"
                max="100000"
                className="border p-3 rounded-lg bg-white"
                onChange={handleChange}
                value={formData.discountPrice}
              />
              <label htmlFor="discountedPrice" className="text-sm mt-1">
                Discounted price{" "}
                <span className="text-gray-500">($ / Month)</span>
              </label>
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className="flex flex-col gap-4 flex-1">
          <p className="font-semibold">
            Images:{" "}
            <span className="font-normal text-gray-600">
              First image will be the cover (max 6)
            </span>
          </p>

          <div className="flex items-center gap-2">
            <input
              onChange={(e) => setFiles(Array.from(e.target.files))}
              type="file"
              accept=".jpg,.png,.jpeg"
              multiple
              className="border border-gray-300 rounded px-3 py-2 w-full bg-white text-gray-700"
            />
            <button
              onClick={handleImageSubmit}
              type="button"
              disabled={uploading}
              className={`border px-4 py-2 rounded hover:shadow-lg ${
                uploading
                  ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                  : "text-green-700 border-green-700"
              }`}
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>

          {/* 🔴 Display error if any */}
          {imageUploadError && (
            <p className="text-red-600 text-sm">{imageUploadError}</p>
          )}

          {/* ✅ Uploaded Image Preview (Optional) */}
          {formData.imageUrls.length > 0 && (
            <div className="flex flex-col gap-2">
              {formData.imageUrls.map((url, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center p-3 border rounded-lg"
                >
                  <img
                    src={url}
                    alt={`listing image ${idx}`}
                    className="w-20 h-20 object-contain rounded-lg"
                  />
                  <button
                    type="button"
                    className="p-3 text-red-700 rounded-lg uppercase hover:opacity-95"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        imageUrls: prev.imageUrls.filter(
                          (item) => item !== url
                        ),
                      }))
                    }
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            disabled={loading || uploading}
            type="submit"
            className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-70"
          >
            {loading ? "Updating..." : "Update Listing"}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
}
