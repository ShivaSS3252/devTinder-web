import axios from "axios";
import React from "react";
import { Base_url } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";

const UserCard = ({ user }) => {
  console.log("usrcard", user);
  const dispatch = useDispatch();
  const handleRequestsend = async (status, userid) => {
    try {
      const res = await axios.post(
        Base_url + "/request/send/" + status + "/" + userid,
        {},
        { withCredentials: true }
      );
      dispatch(removeUserFromFeed(userid));
    } catch (err) {
      console.error(err);
    }
  };
  const { _id, firstName, lastName, photoUrl, age, gender, about } = user;
  return (
    <div className="card card-compact bg-base-300 w-96 shadow-xl">
      <figure>
        <img src={photoUrl} alt="photo" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{firstName + " " + lastName}</h2>
        {age && gender && <p>{age + " " + gender}</p>}
        <p>{about}</p>
        <div className="card-actions justify-center my-4">
          <button
            className="btn btn-primary"
            onClick={() => handleRequestsend("ignored", _id)}
          >
            Ignore
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => handleRequestsend("interested", _id)}
          >
            Interested
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
