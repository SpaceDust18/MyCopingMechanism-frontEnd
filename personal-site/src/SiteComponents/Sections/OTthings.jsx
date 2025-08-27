// src/SiteComponents/Sections/OTThings.jsx
import React from "react";
import SectionEditor from "./SectionEditor";

export default function OTThings(props) {
  return (
    <>
    <h1>OT Things!</h1>
      <SectionEditor slug="ot-things" {...props} />
    </>
  )
}