import React from "react";
import "./About.css";

export default function About() {
  return (
    <section className="about-section">
      <h1>About MyCopingMechanism</h1>
      <p>
        Welcome to <strong>MyCopingMechanism</strong> — a safe space designed to share tips,
        experiences, and resources to help you cope with life’s challenges. This platform
        was created to promote mental well-being, self-awareness, and community support.
      </p>

      <p>
        Here, you’ll find blog posts, helpful articles, and tools to make your journey
        toward a healthier mind easier. Our mission is simple: to remind you that you are
        not alone and that coping strategies can make a big difference.
      </p>

      <div className="about-highlight">
        <h2>Why We Exist</h2>
        <ul>
          <li>To provide accessible mental health resources.</li>
          <li>To share personal stories and practical coping tips.</li>
          <li>To build a supportive community for growth and healing.</li>
        </ul>
      </div>

      <p className="about-cta">
        Explore our posts, join the conversation, and take the first step towards a better
        you. 💜
      </p>
    </section>
  );
}