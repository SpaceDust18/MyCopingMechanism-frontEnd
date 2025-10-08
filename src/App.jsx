import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Register from "./SiteComponents/Forms/Register.jsx";
import Login from "./SiteComponents/Forms/Login.jsx";
import Profile from "./SiteComponents/Sections/Profile.jsx";
import Comments from "./SiteComponents/Forms/Comments";
import Contact from "./SiteComponents/Forms/Contact";
import SearchBar from "./SiteComponents/Forms/SearchBar";

import About from "./SiteComponents/Sections/About";
import Blog from "./SiteComponents/Sections/Blog";
import NewPost from "./SiteComponents/Forms/NewPost.jsx";
import Posts from "./SiteComponents/Sections/Posts.jsx";
import SinglePost from "./SiteComponents/Sections/SinglePost.jsx";
import MindBody from "./SiteComponents/Sections/MindBody.jsx";
import NavBar from "./SiteComponents/Sections/NavBar";
import NotFound from "./SiteComponents/Sections/NotFound.jsx";
import Nutrition from "./SiteComponents/Sections/Nutrition";
import OTthings from "./SiteComponents/Sections/OTthings";
import Privacy from "./SiteComponents/Sections/Privacy";
import Quote from "./SiteComponents/Sections/Quote";
import Reflections from "./SiteComponents/Sections/Reflections.jsx";
import Home from "./SiteComponents/Home";
import Footer from "./SiteComponents/Sections/Footer.jsx";

import "./App.css";
import "./SiteComponents/Sections/NotFound.css";

// Prevents irrational scrolling behavior
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem("authToken") || null);
  const [searchQuery, setSearchQuery] = useState("");
  const [authUser, setAuthUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  return (
    <>
      <ScrollToTop />
      {/* Navbar outside the routes so it appears globally */}
      <NavBar authUser={authUser} setAuthUser={setAuthUser} setToken={setToken} />

      <Routes>
        <Route path="/" element={<Home />} />

        {/* Auth */}
        <Route path="/login" element={<Login setAuthUser={setAuthUser} setToken={setToken} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile authUser={authUser} />} />

        {/* Utility */}
        <Route
          path="/search"
          element={<SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />}
        />

        {/* Blog / Posts */}
        <Route path="/posts" element={<Posts />} />
        <Route path="/posts/:id" element={<SinglePost authUser={authUser} token={token} />} />
        <Route path="/blog" element={authUser ? <Blog /> : <Navigate to="/" />} />
        <Route
          path="/admin/new-post"
          element={
            authUser?.role === "admin" ? (
              <NewPost token={token} authUser={authUser} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* CMS Sections using SectionEditor under the hood */}
        <Route path="/about" element={<About authUser={authUser} token={token} />} />
        <Route path="/mind-body" element={<MindBody authUser={authUser} token={token} />} />
        <Route path="/nutrition" element={<Nutrition authUser={authUser} token={token} />} />
        <Route path="/otthings" element={<OTthings authUser={authUser} token={token} />} />

        {/* Misc */}
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/quote" element={<Quote />} />
        <Route path="/reflections" element={<Reflections authUser={authUser} token={token} />} />
        <Route path="/contact" element={<Contact />} />

        {/* Standalone comments page (optional) */}
        <Route
          path="/comments"
          element={authUser ? <Comments authUser={authUser} token={token} /> : <Navigate to="/login" />}
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </>
  );
}