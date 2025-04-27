import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  addbookmark,
  removeBookmark,
  addPreviousBookmark,
} from "../utils/bookmarkSlice";
import { BookmarkCheck, BookmarkPlus } from "lucide-react"; // Icons
import { toast } from "react-toastify";

const Bookmark = () => {
  const dispatch = useDispatch();
  const bookmarks = useSelector((store) => store.bookmark.bookmarkedProfiles);
  const prevBookmarks = useSelector(
    (store) => store.bookmark.previouslyBookmarkedProfiles
  );

  const [showPrevious, setShowPrevious] = useState(false);

  const fetchbookMark = async () => {
    try {
      const res = await axios.get(
        process.env.REACT_BACKEND_URL + "/bookmarked-profiles",
        {
          withCredentials: true,
        }
      );

      dispatch(addbookmark(res?.data?.bookmarkedProfiles));
      dispatch(addPreviousBookmark(res?.data?.previouslyBookmarkedProfiles));
    } catch (err) {
      console.error(err);
    }
  };

  const handleUnbookmark = async (userId) => {
    try {
      await axios.delete(
        `${process.env.REACT_BACKEND_URL}/bookmark/${userId}`,
        {
          withCredentials: true,
        }
      );

      dispatch(removeBookmark(userId));
      toast.success("Profile Unbookmarked");
      fetchbookMark(); // Refresh after unbookmarking
    } catch (err) {
      console.error(
        "Error Unbookmarking profile:",
        err.response?.data || err.message
      );
    }
  };

  const handleReBookmark = async (userId) => {
    try {
      await axios.put(
        `${process.env.REACT_BACKEND_URL}/bookmark/${userId}`,
        {},
        { withCredentials: true }
      );
      toast.success("Profile Rebookmarked");

      fetchbookMark(); // Refresh after re-bookmarking
    } catch (err) {
      console.error(
        "Error Re-Bookmarking profile:",
        err.response?.data || err.message
      );
    }
  };

  useEffect(() => {
    fetchbookMark();
  }, []);

  return (
    <div className="text-center my-10 mb-20">
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-bold text-gray-300 bg-gray-800 px-6 py-3 rounded-lg shadow-lg inline-block">
          Bookmarks
        </h1>

        {/* Toggle Button */}
        <button
          className="mt-6 px-4 py-2 bg-purple-700 text-white font-semibold rounded-lg shadow-md hover:bg-purple-500 transition"
          onClick={() => setShowPrevious(!showPrevious)}
        >
          {showPrevious ? "Show Active Bookmarks" : "Show Previous Bookmarks"}
        </button>
      </div>

      {/* Bookmarked Profiles (Only show when showPrevious is false) */}
      {!showPrevious && bookmarks.length > 0 ? (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Bookmarked Profiles
          </h2>
          {bookmarks.map(
            ({ _id, firstName, lastName, about, skills, photoUrl }) => (
              <div
                key={_id}
                className="flex m-4 p-4 rounded-lg bg-gray-900 w-1/2 mx-auto justify-between items-center"
              >
                <div>
                  {photoUrl ? (
                    <img
                      alt="photo"
                      className="w-20 h-20 rounded-full"
                      src={photoUrl}
                    />
                  ) : (
                    <img
                      src={
                        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                      }
                      alt="photo"
                      className="w-20 h-20 rounded-full"
                    />
                  )}
                </div>
                <div className="text-left mx-4">
                  <h2 className="font-bold text-xl text-white">
                    {firstName} {lastName}
                  </h2>
                  {about && (
                    <div className="max-w-xs max-h-20 overflow-y-auto p-2 bg-gray-800 rounded-md">
                      <p className="text-gray-200 text-sm">{about}</p>
                    </div>
                  )}
                  {skills && (
                    <p className="text-gray-400">Skills: {skills.join(", ")}</p>
                  )}
                </div>
                <div
                  className="ml-auto cursor-pointer text-red-400 hover:text-white transition"
                  title="Unbookmark this profile"
                  onClick={() => handleUnbookmark(_id)}
                >
                  <BookmarkCheck size={22} />
                </div>
              </div>
            )
          )}
        </div>
      ) : (
        !showPrevious && (
          <p className="text-gray-400 mt-3 text-lg">
            No active bookmarks found.
          </p>
        )
      )}

      {/* Previously Bookmarked Profiles (Only show when showPrevious is true) */}
      {showPrevious && prevBookmarks.length > 0 ? (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-green-400 mb-4">
            Previously Bookmarked Profiles
          </h2>
          {prevBookmarks.map(
            ({ _id, firstName, lastName, about, skills, photoUrl }) => (
              <div
                key={_id}
                className="flex m-4 p-4 rounded-lg bg-gray-800 w-1/2 mx-auto justify-between items-center"
              >
                <div>
                  {photoUrl ? (
                    <img
                      alt="photo"
                      className="w-20 h-20 rounded-full"
                      src={photoUrl}
                    />
                  ) : (
                    <img
                      src={
                        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                      }
                      alt="photo"
                      className="w-20 h-20 rounded-full"
                    />
                  )}
                </div>
                <div className="text-left mx-4">
                  <h2 className="font-bold text-xl text-white">
                    {firstName} {lastName}
                  </h2>
                  {about && (
                    <div className="max-w-xs max-h-20 overflow-y-auto p-2 bg-gray-800 rounded-md">
                      <p className="text-gray-200 text-sm">{about}</p>
                    </div>
                  )}
                  {skills && (
                    <p className="text-gray-400">Skills: {skills.join(", ")}</p>
                  )}
                </div>
                <div
                  className="ml-auto cursor-pointer text-green-400 hover:text-white transition"
                  title="Re-Bookmark this profile"
                  onClick={() => handleReBookmark(_id)}
                >
                  <BookmarkPlus size={22} />
                </div>
              </div>
            )
          )}
        </div>
      ) : (
        showPrevious && (
          <p className="text-gray-400 mt-3 text-lg">
            No previously bookmarked profiles found.
          </p>
        )
      )}
    </div>
  );
};

export default Bookmark;
