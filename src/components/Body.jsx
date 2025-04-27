import React, { useEffect } from "react";
import Navbar from "./Navbar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";

const Body = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const userData = useSelector((store) => store.user);
  const fetchUser = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/profile/view`,
        {
          withCredentials: true, // Required for cookies/auth
        }
      );
      dispatch(addUser(res.data));
    } catch (err) {
      console.error("Error fetching user:", err);
      if (err.status === 404) {
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <div>
      <Navbar />
      <Outlet key={location.pathname} />
      <Footer />
    </div>
  );
};

export default Body;
