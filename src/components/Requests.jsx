import axios from "axios";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequests } from "../utils/requestSlice";
import { useEffect } from "react";
import { useState } from "react";

const Requests = () => {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();
  const [showbutton, setShowbutton] = useState(true);
  const reviewRequest = async (status, _id) => {
    try {
      const res = await axios.post(
        import.meta.env.VITE_BACKEND_URL +
          "/request/review/" +
          status +
          "/" +
          _id,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequests(_id));
    } catch (err) {
      console.error(err);
    }
  };
  const fetchRequests = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_BACKEND_URL + "/user/requests/received",
        {
          withCredentials: true,
        }
      );
      dispatch(addRequests(res?.data?.data));
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchRequests();
  }, []);
  if (!requests) return;
  if (requests.length === 0)
    return (
      <div className="flex flex-col items-center justify-center my-20 text-center">
        <h1 className="text-4xl font-extrabold text-gray-400 hover:text-gray-600 transition duration-300">
          📭 No pending requests!
        </h1>
        <p className="text-lg text-gray-500 mt-2">
          Your inbox is empty... for now! Keep exploring new connections. ✨
        </p>
      </div>
    );
  return (
    <div className=" text-center my-10  mb-20">
      <h1 className="text-3xl font-bold text-gray-300 bg-gray-800 px-6 py-3 rounded-lg shadow-lg inline-block">
        Connection Requests
      </h1>
      {requests.map((request) => {
        const { _id, firstName, lastName, photoUrl, age, gender, about } =
          request.fromUserId;
        return (
          <div
            key={_id}
            className="flex justify-between items-center m-4 p-4 rounded-lg bg-base-300 w-1/2 mx-auto"
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
                  alt="photo"
                  className="w-20 h-20 rounded-full"
                  src={
                    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                  }
                />
              )}
            </div>
            <div className="flex flex-col items-center mx-4 text-left gap-1 ">
              <h2 className="font-bold text-xl">
                {firstName + " " + lastName}
              </h2>
              {age && gender && (
                <p className="text-gray-200">{age + " " + gender}</p>
              )}
              {about && (
                <div className="max-w-xs max-h-20 overflow-y-auto p-2 bg-gray-800 rounded-md">
                  <p className="text-gray-200 text-sm">{about}</p>
                </div>
              )}
              {request?.message && (
                <div className="max-w-xs max-h-20 overflow-y-auto p-2 rounded-md">
                  <p className="text-gray-200 text-sm">
                    Message : {request?.message}
                  </p>
                </div>
              )}
            </div>

            <div className="card-actions justify-center my-4">
              <button
                className="btn bg-gray-700 text-gray-300 border-gray-500 hover:bg-gray-800 uppercase"
                onClick={() => reviewRequest("rejected", request._id)}
              >
                Reject
              </button>
              <button
                className="btn bg-purple-600 text-white hover:bg-purple-700 uppercase"
                onClick={() => reviewRequest("accepted", request._id)}
              >
                Accept
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Requests;
