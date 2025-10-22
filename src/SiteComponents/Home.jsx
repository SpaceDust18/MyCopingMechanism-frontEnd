// src/SiteComponents/Home.jsx
import { useLayoutEffect } from "react";
import Hero from "./Sections/Hero";
import Quote from "./Sections/Quote.jsx";
import Reflections from "./Sections/Reflections.jsx";
import Blog from "./Sections/Blog.jsx";
import MindBody from "./Sections/MindBody.jsx";
import Nutrition from "./Sections/Nutrition.jsx";
import OTThings from "./Sections/OTthings.jsx";
import Contact from "./Forms/Contact.jsx";

export default function Home() {
  // Land at the top on initial mount
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Hero />
      <Quote />
      {/* Prevent reflections from auto-scrolling the window on Home */}
      <Reflections autoScroll={false} />
      <Blog />
      <MindBody />
      <Nutrition />
      <OTThings />
      <Contact />
    </>
  );
}