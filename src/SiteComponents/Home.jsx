import Hero from "./Sections/Hero";
import About from "./Sections/About.jsx";
import Blog from "./Sections/Blog.jsx";
import Hobbies from "./Sections/Hobbies.jsx";
import Nutrition from "./Sections/Nutrition.jsx";
import OTThings from "./Sections/OTthings.jsx";
import Quote from "./Sections/Quote.jsx";
import Reflections from "./Sections/Reflections.jsx";
import Contact from "./Forms/Contact.jsx"
import { useEffect } from "react";

export default function Home() {

  useEffect(() => {
    window.scrollTo(0, 0);
    requestAnimationFrame(() => window.scrollTo(0, 0))
    }, []);
    
  return (
    <>
      <Hero />
      <About />
      <Blog />
      <Hobbies />
      <Nutrition />
      <OTThings />
      <Quote />
      <Reflections />
      <Contact />
    </>
  );
}