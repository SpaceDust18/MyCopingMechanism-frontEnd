import Hero from "./Sections/Hero";
import Blog from "./Sections/Blog.jsx";
import Quote from "./Sections/Quote.jsx";
import Hobbies from "./Sections/Hobbies.jsx";
import About from "./Sections/About.jsx";
import Nutrition from "./Sections/Nutrition.jsx";
import OTThings from "./Sections/OTthings.jsx";

export default function Home() {
  return (
    <>
      <Hero />
      <Blog />
      <Quote />
      <Hobbies />
      <Nutrition />
      <OTThings />
      <About />
    </>
  );
}