import { Link } from "react-router-dom";
import { useState } from "react";
import "./NavBar.css";

export default function NavBar({ authUser, setAuthUser, setToken }) {
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        setAuthUser(null);
        setToken(null);
        setIsOpen(false);
    };

    const toggleMenu = () => setIsOpen(prev => !prev)

    return (
        <nav className="navbar">
            <div className="logo">MyCopingMechanism</div>

            <div className={`nav-links ${isOpen ? 'open' : ''}`}>
                <Link to="/">Home</Link>
                <Link to="/about">About</Link>
                <Link to="/blog">Blog</Link>
                <Link to="/contact">Contact</Link>
            </div>

            <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
                <div className="line" />
                <div className="line" />
                <div className="line" />
            </div>
        </nav >
    );
}


