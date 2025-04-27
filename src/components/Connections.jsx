import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import { toast } from "react-toastify";

const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector((store) => store.connections);
  const fetchConnections = async () => {
    try {
      const res = await axios.get(
        process.env.REACT_BACKEND_URL + "/user/connections",
        {
          withCredentials: true,
        }
      );
      dispatch(addConnections(res?.data?.data));
    } catch (err) {
      console.error(err);
    }
  };

  const handleUnfollow = async (connectionId) => {
    try {
      await axios.post(
        `${process.env.REACT_BACKEND_URL}/request/unfollow/${connectionId}`,
        {},
        { withCredentials: true }
      );
      // Remove the unfollowed user from the UI
      toast.success("User Unfollowed Successfully");
      dispatch(
        addConnections(connections.filter((c) => c._id !== connectionId))
      );
    } catch (err) {
      console.error("Error unfollowing:", err);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections) return null;
  if (connections.length === 0)
    return (
      <div className="flex flex-col items-center justify-center my-20 text-center">
        <h1 className="text-4xl font-extrabold text-gray-400 hover:text-gray-600 transition duration-300">
          🤝 No connections yet!
        </h1>
        <p className="text-lg text-gray-500 mt-2">
          Start connecting with amazing people today! 🚀
        </p>
      </div>
    );

  return (
    <div className="text-center my-10 mb-20">
      <h1 className="text-3xl font-bold text-gray-300 bg-gray-800 px-6 py-3 rounded-lg shadow-lg inline-block">
        Connections
      </h1>
      {connections.map((connection) => {
        const { _id, firstName, lastName, photoUrl, age, gender, about } =
          connection;
        return (
          <div
            key={_id}
            className="flex justify-between items-center m-4 p-4 rounded-lg bg-base-300 w-1/2 mx-auto"
          >
            <div className="flex items-center">
              <img
                alt="profile"
                className="w-20 h-20 rounded-full"
                src={
                  photoUrl ||
                  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                }
              />
              <div className="text-left mx-4">
                <h2 className="font-bold text-xl">
                  {firstName + " " + lastName}
                </h2>
                {age && gender && <p>{age + " " + gender}</p>}
                {about && (
                  <div className="max-w-xs max-h-20 overflow-y-auto p-2 bg-gray-800 rounded-md">
                    <p className="text-gray-200 text-sm">{about}</p>
                  </div>
                )}
              </div>
            </div>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
              onClick={() => handleUnfollow(_id)}
            >
              Unfollow
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Connections;
