import React, { useState } from "react";

export default function CreateListing() {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
  });
  const [imageUploadError, setImageUploadError] = useState(null);
  const [uploading, setUploading] = useState(false); // ⬅ For loading feedback

  console.log(formData);

  // ✅ Cloudinary Config
  const cloudName = "dc0wr37lq";
  const uploadPreset = "listing_uploads"; // Replace with your unsigned preset

  // ✅ Store image in Cloudinary
  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);
      formData.append("cloud_name", cloudName);

      fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      })
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

  // ✅ Handle Image Submit
  const handleImageSubmit = async (e) => {
    e.preventDefault();
    setImageUploadError(null); // clear previous errors

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
      setFiles([]); // clear selected files after upload
      alert("Images uploaded successfully");
    } catch (error) {
      console.error("Image upload failed", error);
      setImageUploadError("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

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
            {["sell", "rent", "parking", "furnished", "offer"].map((id) => (
              <div className="flex items-center gap-2" key={id}>
                <input type="checkbox" id={id} className="w-5 h-5" />
                <label htmlFor={id} className="capitalize">
                  {id.replace(/([a-z])([A-Z])/g, "$1 $2")}
                </label>
              </div>
            ))}
          </div>

          <div className="flex gap-6">
            {["beds", "baths"].map((id) => (
              <div className="flex flex-col" key={id}>
                <input
                  type="number"
                  id={id}
                  min="1"
                  max="10"
                  defaultValue={1}
                  required
                  className="border p-3 rounded-lg bg-white"
                />
                <label htmlFor={id} className="text-sm mt-1 capitalize">
                  {id}
                </label>
              </div>
            ))}
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
