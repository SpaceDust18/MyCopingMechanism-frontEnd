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
        <Link to="/" onClick={() => setIsOpen(false)}>MyCopingMechanism</Link>
      </div>

      <div className={`nav-links ${isOpen ? "open" : ""}`}>
        <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
        <Link to="/about" onClick={() => setIsOpen(false)}>About</Link>
        <Link to="/posts" onClick={() => setIsOpen(false)}>Posts</Link>       
        <Link to="/hobbies" onClick={() => setIsOpen(false)}>Hobbies</Link>
        <Link to="/nutrition" onClick={() => setIsOpen(false)}>Nutrition</Link>
        <Link to="/otthings" onClick={() => setIsOpen(false)}>OT Things</Link>
        <Link to="/privacy" onClick={() => setIsOpen(false)}>Privacy</Link>
        <Link to="/quote" onClick={() => setIsOpen(false)}>Quote</Link>
        <Link to="/contact" onClick={() => setIsOpen(false)}>Contact</Link>

        {/* Admin-only link */}
        {authUser?.role === "admin" && (
          <Link to="/admin/new-post" onClick={() => setIsOpen(false)}>New Post</Link>
        )}
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