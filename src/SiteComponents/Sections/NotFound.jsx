import React from "react";
import { Link } from "react-router-dom";
import "./NotFound.css"; // Optional if you want custom styling

export default function NotFound() {
    return (
        <div className="not-found-container">
            <h1>404 - Page Not Found</h1>
            <img src="/assets/404-illustration.png" alt="Not Found" />
            <p>Oops! The page you’re looking for doesn’t exist.</p>
            <Link to="/" className="home-link">Return to Home</Link>
        </div>
    );
}