import { useState, useEffect } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Comments from './SiteComponents/Forms/Comments';
import Contact from './SiteComponents/Forms/Contact';
import SearchBar from './SiteComponents/Forms/SearchBar';
import About from './SiteComponents/Sections/About';
import Blog from './SiteComponents/Sections/Blog';
import Hobbies from './SiteComponents/Sections/Hobbies';
import NavBar from './SiteComponents/Sections/NavBar';
import Nutrition from './SiteComponents/Sections/Nutrition';
import OTthings from './SiteComponents/Sections/OTthings';
import Privacy from './SiteComponents/Sections/Privacy';
import Quote from './SiteComponents/Sections/Quote';
import Home from './SiteComponents/Home';


export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem("authToken"));
  const [searchQuery, setSearchQuery] = useState("");
  const [authUser, setAuthUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error )
      return null;
    }
  }); 


  return (
return (
  <Router>
    <NavBar />
    <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/hobbies" element={<Hobbies />} />
      <Route path="/nutrition" element={<Nutrition />} />
      <Route path="/ot" element={<OTthings />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/comments" element={<Comments />} />
      <Route path="/quote" element={<Quote />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  </Router>
  );
}


