import React from "react";
import SectionEditor from "./SectionEditor.jsx";
import "./About.css";

export default function About(props) {
  return (
    <section className="about-section">
      <h1>About MyCopingMechanism</h1>
      <SectionEditor slug="about" {...props} />
    </section>
  );
}