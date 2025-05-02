import { useState } from "react";
import "./Landing.css";
import CustomButton from "../components/Button";

export default function ContactUs() {
  const [searchText, setSearchText] = useState("");

  return (
    <div className="landing-container">
      <section className="section hero">
        <h1 className="landing-title">
          Contact Us
        </h1>
      </section>

      {/* Section 2 (Contact-Us Form) */}
      <section className="section split-section left-image">
        <div className="left-box">
          <img src={MenueBefore} alt="Menu Before" />
        </div>
        <div className="right-text">
          <h3>Want to contact us?</h3>
          <p>
          Have questions, feedback, or need help finding the perfect restaurant for your dietary needs?
          We're here to help!
          Whether you're looking for more information about our platform, want to suggest a restaurant,
          or just have something to share, feel free to reach out. Your experience matters to us.
          </p>
        </div>
      </section>

      <section className="section footer-section"></section>
    </div>
  );
}
