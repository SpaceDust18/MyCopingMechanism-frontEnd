import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <h3 className="footer-logo">MyCopingMechanism</h3>
        <ul className="footer-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/posts">Posts</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/hobbies">Hobbies</Link></li>
          <li><Link to="/nutrition">Nutrition</Link></li>
          <li><Link to="/otthings">OT Things</Link></li>
          <li><Link to="/privacy">Privacy</Link></li>
          <li><Link to="/quote">Quote</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
        <p className="footer-copy">
          © {new Date().getFullYear()} MyCopingMechanism. All rights reserved.
        </p>
      </div>
    </footer>
  );
}