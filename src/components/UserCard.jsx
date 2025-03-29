import React, { useState, useEffect } from "react";
import axios from "axios";
import { Base_url } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed, addFeed } from "../utils/feedSlice";
import { Bookmark, BookmarkCheck } from "lucide-react"; // Bookmark icons
import { toast } from "react-toastify"; // Import toast for notifications
import { addbookmark, removeBookmark } from "../utils/bookmarkSlice";
import { useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
const UserCard = ({ user }) => {
  console.log("usercarddetails", user);
  const dispatch = useDispatch();
  const bookmarks = useSelector((store) => store.bookmark.bookmarkedProfiles);

  const isBookmarked = bookmarks.some((b) => b._id === user?._id);

  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);

  // Handle opening the modal when clicking "Interested"
  const openModal = (userid) => {
    setSelectedUserId(userid);
    setShowModal(true);
  };

  // Handle closing the modal
  const closeModal = () => {
    setShowModal(false);
    setMessage(""); // Reset message when closing modal
  };

  // Send request function
  const handleRequestSend = async (status, userid, message = "") => {
    try {
      const requestBody = status === "ignored" ? {} : { message };
      await axios.post(
        `${Base_url}/request/send/${status}/${userid}`,
        requestBody,
        { withCredentials: true }
      );
      console.log("reqssned", `${Base_url}/request/send/${status}/${userid}`);
      dispatch(removeUserFromFeed(userid));
      if (status === "interested") {
        toast.success("Profile is marked as Interested!");
      } else if (status === "ignored") {
        toast.info("Profile is ignored.");
      }
      closeModal(); // Close modal after sending request
    } catch (err) {
      console.error(err);
    }
  };

  // Handle bookmark toggle
  const handleBookMarkToggle = async (userId) => {
    try {
      if (isBookmarked) {
        await axios.delete(`${Base_url}/bookmarkFeed/${userId}`, {
          withCredentials: true,
        });
        dispatch(removeBookmark(userId));
        toast.info("Removed from Bookmarks!");
      } else {
        await axios.post(
          `${Base_url}/bookmark`,
          { bookmarkedUserId: userId },
          { withCredentials: true }
        );
        const res = await axios.get(`${Base_url}/bookmarked-profiles`, {
          withCredentials: true,
        });
        dispatch(addbookmark(res?.data?.bookmarkedProfiles)); // Update Redux store
        toast.success("Added to Bookmarks!");
      }
    } catch (err) {
      console.error(
        "Error toggling bookmark:",
        err.response?.data || err.message
      );
    }
  };
  const ignorelists = async (status, userid, message = "") => {
    try {
      const requestBody = status === "ignored" ? {} : { message };
      await axios.post(
        `${Base_url}/request/send/ignored/${userid}`,
        requestBody,
        { withCredentials: true }
      );
      dispatch(removeUserFromFeed(userid));
      closeModal(); // Close modal after sending request
    } catch (err) {
      console.error(err);
    }
  };
  const {
    _id,
    firstName,
    lastName,
    photoUrl,
    age,
    gender,
    about,
    mutualConnections,
    mutualConnectionUsers,
  } = user;

  return (
    <div className="card card-compact bg-base-300 w-80 shadow-xl mb-10">
      <figure>
        {photoUrl ? (
          <img src={photoUrl} alt="photo" className="w-full max-h-72" />
        ) : (
          <img
            src={
              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
            }
            alt="photo"
            className="w-full max-h-72"
          />
        )}
      </figure>
      <div className="card-body relative">
        <div
          className="absolute top-4 right-4 cursor-pointer text-gray-400 hover:text-white transition"
          title={
            isBookmarked ? "Unbookmark this profile" : "Bookmark this profile"
          }
          onClick={() => handleBookMarkToggle(_id)}
        >
          {isBookmarked ? <BookmarkCheck size={22} /> : <Bookmark size={22} />}
        </div>
        <h2 className="card-title text-lg font-bold">
          {firstName + " " + lastName}
        </h2>
        {age && gender && (
          <p className="text-sm text-gray-400">{age + " • " + gender}</p>
        )}
        {about && (
          <div className="max-w-xs max-h-20 overflow-y-auto p-2 bg-gray-800 rounded-md">
            <p className="text-gray-200 text-sm">{about}</p>
          </div>
        )}

        {mutualConnections > 0 && (
          <div className="mt-3 p-2 bg-gray-800 rounded-lg">
            <p className="text-sm font-semibold text-gray-300">
              {mutualConnections} Mutual Connection
              {mutualConnections > 1 ? "s" : ""}
            </p>
            <div className="flex flex-wrap mt-1">
              {mutualConnectionUsers.slice(0, 2).map((name, index) => (
                <span
                  key={index}
                  className="bg-gray-700 text-xs text-white px-2 py-1 rounded-lg mr-2 mb-1"
                >
                  {name}
                </span>
              ))}
              {mutualConnections > 2 && (
                <span className="text-xs text-gray-400">
                  +{mutualConnections - 2} more
                </span>
              )}
            </div>
          </div>
        )}
        <div className="card-actions justify-center my-4">
          <button
            className="btn bg-gray-700 text-gray-300 border-gray-500 hover:bg-gray-800 uppercase"
            onClick={() => handleRequestSend("ignored", _id)}
          >
            Ignore
          </button>
          <button
            className="btn bg-purple-600 text-white hover:bg-purple-700 uppercase"
            onClick={() => openModal(_id)}
          >
            Interested
          </button>
        </div>
      </div>

      {/* Modal for entering a message */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-2">Send Interest</h2>
            <textarea
              className="w-full h-24 border rounded p-2"
              placeholder="Message(Optional)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className="flex justify-end mt-4">
              <button className="btn btn-info mr-2" onClick={closeModal}>
                Cancel
              </button>
              <button
                className="btn btn-success"
                onClick={() =>
                  handleRequestSend("interested", selectedUserId, message)
                }
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserCard;
