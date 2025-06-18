import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from "../redux/user/userSlice";
import { Link, useNavigate } from "react-router-dom";

export default function Profile() {
  const { currentUser, loading, error } = useSelector((s) => s.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fileRef = useRef();
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingError, setShowListingError] = useState(false);
  const [userListing, setUserListing] = useState([]);
  const [formData, setFormData] = useState({
    username: currentUser.username,
    email: currentUser.email,
    password: "",
    avatar: currentUser.avatar,
  });

  useEffect(() => {
    if (file) uploadImage(file);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  const uploadImage = async (selectedFile) => {
    setUploadProgress(0);
    setUploadComplete(false);
    setFileUploadError(false);

    const fd = new FormData();
    fd.append("file", selectedFile);
    fd.append("upload_preset", "unsigned_preset");

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dc0wr37lq/image/upload",
        fd,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (e) => {
            const percent = Math.round((e.loaded * 100) / e.total);
            setUploadProgress(percent);
          },
        }
      );

      if (res.data.secure_url) {
        setFormData((prev) => ({ ...prev, avatar: res.data.secure_url }));
        setUploadComplete(true);
      } else {
        setFileUploadError(true);
      }
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      setFileUploadError(true);
    }
  };

  /////////Event listner handleChange----------
  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.id]: e.target.value }));

  /////////Event listner handleSubmit-----------

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateSuccess(false);
    dispatch(updateUserStart());

    // Clone the formData but remove password if it's empty
    const userDataToSend = { ...formData };
    if (!userDataToSend.password) delete userDataToSend.password;

    try {
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userDataToSend),
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (err) {
      dispatch(updateUserFailure(err.message));
    }
  };

  ////////////handleDeleteUser
  const handleDeleteUser = async (e) => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success == false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  ///////////Signout User/////7
  const handleSignOutUser = async (req, res, next) => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success == false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error));
    }
  };

  /////////////////////////
  //HANDLE SHOW LISTING
  const handleShowListing = async () => {
    try {
      setShowListingError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingError(true);
        return;
      }
      setUserListing(data); // ✅ This makes listings visible
    } catch (error) {
      setShowListingError(true);
    }
  };
  ///////////////////////////////////////////////////////////////
  //////////HANDLE DELETE LISTING-------------
  const handleDeleteListing = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setUserListing((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };
  //////////////////////////////////////////////////////////////////////
  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          accept="image/*"
          hidden
          ref={fileRef}
          onChange={(e) => setFile(e.target.files[0])}
        />

        <img
          src={formData.avatar}
          onClick={() => fileRef.current.click()}
          alt="avatar"
          className="h-24 w-24 rounded-full object-cover cursor-pointer self-center"
        />

        <div className="text-center text-sm">
          {uploadProgress > 0 && uploadProgress < 100 && (
            <span className="text-blue-600">Uploading… {uploadProgress}%</span>
          )}
          {uploadProgress === 100 && uploadComplete && (
            <span className="text-green-600">✅ Uploaded</span>
          )}
          {fileUploadError && (
            <span className="text-red-600">❌ Upload failed</span>
          )}
        </div>

        <input
          id="username"
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />
        <input
          id="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />
        <input
          id="password"
          type="password"
          placeholder="New password"
          value={formData.password}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />

        <button
          disabled={loading}
          className="bg-blue-700 text-white rounded-lg p-3 uppercase hover:opacity-90"
        >
          {loading ? "Loading..." : "Update"}
        </button>
        <Link
          className="bg-green-700 p-3 text-white rounded-lg uppercase text-center hover:opacity-95"
          to={"/create-listing"}
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer"
        >
          Delete account
        </span>
        <span
          onClick={handleSignOutUser}
          className="text-red-700 cursor-pointer"
        >
          Sign out
        </span>
      </div>
      <div className="mt-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {updateSuccess && (
          <p className="text-green-500 text-sm">
            {" "}
            Profile updated successfully ! ✅
          </p>
        )}
      </div>
      <button className="text-green-700 w-full" onClick={handleShowListing}>
        Show Listings
      </button>

      <p className="text-red-700 mt-5">
        {showListingError ? "Error showing listing" : ""}
      </p>

      {userListing &&
        userListing.length > 0 &&
        userListing.map((listing) => (
          <div
            key={listing._id}
            className="border rounded-lg p-3 flex justify-between items-center gap-4 mb-4"
          >
            <Link to={`/listing/${listing._id}`}>
              <img
                src={listing.imageUrls[0]}
                alt="listing"
                className="h-16 w-16 object-contain rounded-lg"
              />
            </Link>

            <Link className="flex-1" to={`/listing/${listing._id}`}>
              <p className="text-slate-700 font-semibold hover:underline truncate">
                {listing.name}
              </p>
            </Link>

            <div className="flex flex-col items-end gap-1">
              <button
                onClick={() => handleDeleteListing(listing._id)}
                className="text-red-600 hover:underline"
              >
                DELETE
              </button>
              <Link to={`/update-listing/${listing._id}`}>
                <button className="text-green-600 hover:underline">EDIT</button>
              </Link>
            </div>
          </div>
        ))}
    </div>
  );
}
