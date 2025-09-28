// src/SiteComponents/Sections/Hobbies.jsx
import React from "react";
import SectionEditor from "./SectionEditor";

export default function Hobbies({ authUser, token }) {
  return (
    <>
    <h1>Hobbies & more...</h1>
    <SectionEditor
      slug="hobbies"
      authUser={authUser}
      token={token}
      className="solid-cards"
    />
    </>
  );
}