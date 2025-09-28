// src/SiteComponents/Sections/Hero.jsx
import React from "react";
import "./Hero.css";

export default function Hero() {
  return (
    <section id="hero" className="hero" role="banner" tabIndex={-1}>
      <div className="hero-overlay">
        <h1>Welcome to MyCopingMechanism</h1>
        <p>Your space for self care, healing, and growth!</p>
      </div>
    </section>
  );
}