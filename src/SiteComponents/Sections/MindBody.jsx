// src/SiteComponents/Sections/MindBody.jsx
import React from "react";
import SectionEditor from "./SectionEditor";
import "./MindBody.css";

export default function MindBody({ authUser, token }) {
  return (
    <section className="mindbody-section">
      <h1>Mind & Body</h1>
      <h2>
        A space where movement fuels creativity and creativity inspires movement. 
        Here, every step, stretch, and spark of imagination becomes part of your 
        journey to balance, joy, and self-care.
      </h2>
      <SectionEditor
        slug="mind-body"
        authUser={authUser}
        token={token}
        className="solid-cards"
      />
    </section>
  );
}