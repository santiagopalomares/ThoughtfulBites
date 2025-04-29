import { useState } from "react";
import "./Landing.css";

export default function Landing() {
  const [searchText, setSearchText] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      console.log("Search submitted:", searchText);
      setSearchText("");
    }
  };

  return (
    <div className="landing-container">
      <section className="section hero">
        <h1 className="landing-title">Where would you like to eat?</h1>
        <input
          type="text"
          className="search-bar"
          placeholder="Search restaurants, cuisine..."
          value={searchText}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
      </section>

      <section className="section split-section left-image">
        <div className="left-box">
          <div className="grey-box" />
        </div>
        <div className="right-text">
          <h2>Look up the menu ahead of time!</h2>
          <p>More details here about the section yapyayapyapyap</p>
        </div>
      </section>

      <section className="section image-highlight">
        <div className="image-overlay-text">
          <h2>
            Something Something uhhh idk but something interesting that catches
            the eye of the customer
          </h2>
          <p>More details here about the section yapyayapyapyap</p>
        </div>
      </section>

      <section className="section split-section right-image">
        <div className="left-text">
          <h2>Look up the menu ahead of time!</h2>
          <p>More details here about the section yapyayapyapyap</p>
        </div>
        <div className="right-box">
          <div className="grey-box" />
        </div>
      </section>

      <section className="section footer-section"></section>
    </div>
  );
}
