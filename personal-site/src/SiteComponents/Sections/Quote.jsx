import React from "react";
import "./Quote.css";

const quotes = [
  "We must understand that sadness is an ocean, and sometimes we drown, while other days we are forced to swim. ——R.M. Drake",
  "Take it one day at a time.",
  "You are stronger than you think.",
  "Self-care is how you take your power back.",
  "Your story isn’t over yet."
];

export default function Quote() {
  // Pick a random quote on each load
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const selectedQuote = quotes[randomIndex];

  return (
    <section className="quote-section">
      <blockquote className="quote-text">“{selectedQuote}”</blockquote>
    </section>
  );
}