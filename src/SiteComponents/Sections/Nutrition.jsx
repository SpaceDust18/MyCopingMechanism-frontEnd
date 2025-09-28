import React from "react";
import SectionEditor from "./SectionEditor";

export default function Nutrition(props) {
  return (
  <>
  <h1>Nutrition</h1>
  <SectionEditor slug="nutrition" {...props} />
  </>
  )
}