import axios from "axios";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { removeUser } from "../utils/userSlice";

const Navbar = () => {
  const user = useSelector((store) => store.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = async () => {
    try {
      await axios.post(
        process.env.REACT_BACKEND_URL + "/logout",
        {},
        { withCredentials: true }
      );
      dispatch(removeUser());
      return navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  const handleNavigation = () => {
    navigate("/"); // Navigate to Feed
    window.location.reload(); // Force refresh
  };
  return (
    <div className="navbar bg-base-300">
      <div className="flex-1">
        <div className="text-xl">👨‍💻DevConnect</div>
        {user && (
          <button onClick={handleNavigation} className="btn btn-ghost text-xl">
            💬 Start Connecting
          </button>
        )}
      </div>
      {user && (
        <div className="flex-none gap-2">
          <div className="form-control">Welcome, {user.firstName}</div>

          <div className="dropdown dropdown-end mx-5 flex ">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              {user.photoUrl ? (
                <div className="w-10 rounded-full">
                  <img alt="user" src={user.photoUrl} />
                </div>
              ) : (
                <div className="w-10 rounded-full">
                  <img
                    alt="user"
                    src={
                      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                    }
                  />
                </div>
              )}
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link to="/profile" className="justify-between">
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/connections">Connections</Link>
              </li>
              <li>
                <Link to="/requests">Requests</Link>
              </li>
              <li>
                <Link to="/bookmark">Bookmark</Link>
              </li>

              <li>
                <a onClick={handleLogout}>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
