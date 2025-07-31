import { useState, useEffect } from 'react'
import { useLocation } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from './SiteComponents/Forms/Register.jsx'
import Login from './SiteComponents/Forms/Login.jsx'
import Profile from './SiteComponents/Sections/Profile.jsx';
import Comments from './SiteComponents/Forms/Comments';
import Contact from './SiteComponents/Forms/Contact';
import SearchBar from './SiteComponents/Forms/SearchBar';
import About from './SiteComponents/Sections/About';
import Blog from './SiteComponents/Sections/Blog';
import Posts from './SiteComponents/Sections/Posts.jsx';
import SinglePost from './SiteComponents/Sections/SinglePost.jsx';
import Hobbies from './SiteComponents/Sections/Hobbies';
import NavBar from './SiteComponents/Sections/NavBar';
import NotFound from './SiteComponents/Sections/NotFound.jsx';
import Nutrition from './SiteComponents/Sections/Nutrition';
import OTthings from './SiteComponents/Sections/OTthings';
import Privacy from './SiteComponents/Sections/Privacy';
import Quote from './SiteComponents/Sections/Quote';
import Home from './SiteComponents/Home';
import './App.css'
import './SiteComponents/Sections/NotFound.css';
import Footer from './SiteComponents/Sections/Footer.jsx';

//Prevents irrational scrolling behavior
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem("authToken"));
  const [searchQuery, setSearchQuery] = useState("");
  const [authUser, setAuthUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error)
      return null;
    }
  });

  return (
    <>
      <ScrollToTop />
      <NavBar authUser={authUser} setAuthUser={setAuthUser} setToken={setToken} /> 
      {/* Navbar outside the routes so it appears globally */}

      <Routes>

        <Route path="/login" element={<Login setAuthUser={setAuthUser} setToken={setToken} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile authUser={authUser} />} />
        <Route path="/search" element={<SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />} />
        <Route path="/" element={<Home />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/posts/:id" element={<SinglePost />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={authUser ? <Blog /> : <Navigate to="/" />} />
        <Route path="/hobbies" element={<Hobbies />} />
        <Route path="/nutrition" element={<Nutrition />} />
        <Route path="/otthings" element={<OTthings />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/quote" element={<Quote />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/comments" element={authUser ? <Comments /> : <Navigate to="/login" />} />

      </Routes>
      <Footer />
   </>
  )  
}


