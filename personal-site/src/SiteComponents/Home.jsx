import Hero from "./Sections/Hero";
import Blog from "./Sections/Blog.jsx";
import Quote from "./Sections/Quote.jsx";
import Reflections from "./Sections/Reflections.jsx";
import Hobbies from "./Sections/Hobbies.jsx";
import Nutrition from "./Sections/Nutrition.jsx";
import OTThings from "./Sections/OTthings.jsx";
import About from "./Sections/About.jsx";
import Contact from "./Forms/Contact.jsx"

export default function Home() {
  return (
    <>
      <Hero />
      <Blog />
      <Quote />
      <Reflections />
      <Hobbies />
      <Nutrition />
      <OTThings />
      <About />
      <Contact />
    </>
  );
}