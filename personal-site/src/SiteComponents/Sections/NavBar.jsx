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

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to="/">MyCopingMechanism</Link>
            </div>

            <div className={`nav-links ${isOpen ? 'open' : ''}`}>
                <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
                <Link to="/about" onClick={() => setIsOpen(false)}>About</Link>
                <Link to="/posts" onClick={() => setIsOpen(false)}>Posts</Link>
                <Link to="/contact" onClick={() => setIsOpen(false)}>Contact</Link>

                {!authUser ? (
                    <>
                        <Link to="/login" onClick={() => setIsOpen(false)}>Login</Link>
                        <Link to="/register" onClick={() => setIsOpen(false)}>Register</Link>
                    </>
                ) : (
                    <>
                        <Link to="/profile" onClick={() => setIsOpen(false)}>Profile</Link>
                        <button onClick={handleLogout} className="logout-button">Logout</button>
                    </>
                )}
            </div>

            <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
                <div className="line" />
                <div className="line" />
                <div className="line" />
            </div>
        </nav>
    );
}