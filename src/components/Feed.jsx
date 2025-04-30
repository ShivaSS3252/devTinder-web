import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { MdArrowBackIosNew } from "react-icons/md";
import { MdArrowForwardIos } from "react-icons/md";
import { addPreviousBookmark, addbookmark } from "../utils/bookmarkSlice";

const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);
  const [currentIndex, setCurrentIndex] = useState(0);
  const bookmarks = useSelector((store) => store.bookmark.bookmarkedProfiles);
  const prevBookmarks = useSelector(
    (store) => store.bookmark.previouslyBookmarkedProfiles
  );
  const fetchbookMark = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_BACKEND_URL + "/bookmarked-profiles",
        {
          withCredentials: true,
        }
      );

      dispatch(addbookmark(res?.data?.bookmarkedProfiles));
      dispatch(addPreviousBookmark(res?.data?.previouslyBookmarkedProfiles));
    } catch (err) {
      console.error(err);
      if (err.status === 401) {
        navigate("/login");
      }
    }
  };
  const getFeed = async () => {
    if (feed) return;
    try {
      const res = await axios.get(import.meta.env.VITE_BACKEND_URL + "/feed", {
        withCredentials: true,
      });
      dispatch(addFeed(res?.data?.data));
    } catch (err) {
      console.error(err);
      if (err.status === 401) {
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    getFeed();
    fetchbookMark();
  }, []);

  if (!feed || feed.length === 0)
    return (
      <h1 className="flex justify-center my-10 text-3xl md:text-4xl font-extrabold text-gray-500 hover:text-gray-700 transition duration-300">
        🚀 No new feeds available! Check back later. 🔄
      </h1>
    );

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % feed.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + feed.length) % feed.length);
  };

  return (
    <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-8 mt-6 mb-24 px-4 md:px-10 py-10">
      {/* Sidebar Section with DevConnect Info */}
      <div className="max-w-lg p-6 bg-gray-100 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-700">
          🔗 Welcome to DevConnect!
        </h2>
        <p className="mt-3 text-gray-600">
          DevConnect is a platform where developers build meaningful
          professional relationships. Whether you're looking for collaboration
          opportunities, mentorship, or networking, this is the place to be.
        </p>
        <h3 className="mt-4 text-xl font-semibold text-gray-700">
          🤝 Why Connect?
        </h3>
        <ul className="mt-2 text-gray-600 list-disc pl-5">
          <li>Expand your professional network</li>
          <li>Find potential project collaborators</li>
          <li>Get guidance from experienced developers</li>
          <li>Explore job opportunities in your field</li>
        </ul>

        <h3 className="mt-4 text-xl font-semibold text-gray-700">
          🏆 Accept or Ignore? The Choice is Yours!
        </h3>
        <p className="mt-2 text-gray-600">
          - **Accept**: If the profile seems relevant and interesting, accepting
          the request will allow you to engage further. - **Ignore**: If it’s
          not the right fit, you can choose to ignore the request.
        </p>

        <p className="mt-4 text-gray-500 italic">
          Every connection is a new opportunity! 🚀
        </p>
      </div>

      {/* Feed Section with Navigation */}
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={handlePrev}
            className="p-3 rounded-full hover:bg-gray-300 transition"
          >
            <MdArrowBackIosNew size={30} />
          </button>

          <UserCard user={feed[currentIndex]} />
          <button
            onClick={handleNext}
            className="p-3 rounded-full hover:bg-gray-300 transition"
          >
            <MdArrowForwardIos size={30} />
          </button>
        </div>

        {/* Status Indicator */}
        <p className="-mt-4 text-gray-400">
          Viewing {currentIndex + 1} of {feed.length}
        </p>
      </div>
    </div>
  );
};

export default Feed;
