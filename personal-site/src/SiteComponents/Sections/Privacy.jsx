import React from "react";
import "./Privacy.css";

export default function Privacy() {
  return (
    <section className="privacy-section">
      <h2>Privacy Policy</h2>
        <p>
          Your privacy matters to us. At <strong>MyCopingMechanism</strong>, we respect your
          personal information and are committed to protecting it. We do not share your data with third parties without your consent. Any information
          you provide, such as your email or comments, will only be used to enhance your
          experience on this platform.
        </p>

        <div className="privacy-details">
          <h3>What We Collect</h3>
          <ul>
            <li>Email address for account and communication purposes.</li>
            <li>Username for personalization and comments.</li>
            <li>Optional information you choose to share.</li>
          </ul>

          <h3>How We Use It</h3>
          <ul>
            <li>To create and maintain your account.</li>
            <li>To allow community interaction through comments.</li>
            <li>To send updates or important notifications (if you opt in).</li>
          </ul>
        </div>

        <p className="privacy-cta">
          For any questions about your privacy, feel free to <a href="/contact">contact us</a>.
        </p>
    </section>
  );
}