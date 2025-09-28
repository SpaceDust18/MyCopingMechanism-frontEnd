import React from "react";
import "./Quote.css";

const quotes = [
  // Original curated quote
  "We must understand that sadness is an ocean, and sometimes we drown, while other days we are forced to swim. —— R.M. Drake",
  "Healing doesn’t mean the damage never existed. It means the damage no longer controls your life. —— Akshay Dubey",
  "Do not judge me by my success, judge me by how many times I fell and got back up again. —— Nelson Mandela",
  "You either walk inside your story and own it, or you stand outside your story and hustle for your worthiness. —— Brené Brown",
  "Even the darkest night will end, and the sun will rise. —— Victor Hugo",
  "Our wounds are often the openings into the best and most beautiful parts of us. —— David Richo",
  "What lies behind us and what lies before us are tiny matters compared to what lies within us. —— Ralph Waldo Emerson",
  "Just because no one else can heal or do your inner work for you doesn’t mean you can, should, or need to do it alone. —— Lisa Olivera",
  "Be gentle with yourself. You’re doing the best you can. —— Unknown",
  "Rock bottom became the solid foundation on which I rebuilt my life. —— J.K. Rowling",
  "Sometimes the bravest and most important thing you can do is just show up. —— Brené Brown"
];

export default function Quote() {
  // Pick a random quote on each load (later we can switch to weekly rotation)
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const selectedQuote = quotes[randomIndex];

  return (
    <section className="quote-section">
      <h5>Quote of the Week!</h5>
      <blockquote className="quote-text">“{selectedQuote}”</blockquote>
    </section>
  );
}