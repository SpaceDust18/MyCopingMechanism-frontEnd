import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { BrowserRouter as Router, Routes, Router, Navigate } from "react-router-dom";
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
    <>
      <div>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1></h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
         
        </p>
      </div>
      <p >
     
      </p>
    </>
  )
}


