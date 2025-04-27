import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Body from "./components/Body";
import Login from "./components/Login";
import Profile from "./components/Profile";
import { Provider, useDispatch, useSelector } from "react-redux";
import appStore from "./utils/appStore";
import Feed from "./components/Feed";
import Connections from "./components/Connections";
import Requests from "./components/Requests";
import Bookmark from "./components/Bookmark";
import { ToastContainer } from "react-toastify";

function App() {
  const isAuthenticated = localStorage.getItem("isAuthenticated"); // Check authentication

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />
      <Provider store={appStore}>
        <BrowserRouter basename="/">
          <Routes>
            {/* If the user is not authenticated, redirect to the login page */}
            <Route path="/" element={<Body />}>
              <Route path="/" element={<Feed />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/connections" element={<Connections />} />
              <Route path="/requests" element={<Requests />} />
              <Route path="/bookmark" element={<Bookmark />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;
