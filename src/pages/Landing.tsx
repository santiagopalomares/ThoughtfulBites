import { useState } from "react";
import "./Landing.css";
import CustomButton from "../components/Button";
import SearchIcon from "../assets/SearchIcon.png";
import EatingImage from "../assets/EatingLanding.png";
export default function Landing() {
  const [searchText, setSearchText] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleSearch = () => {
    // Only proceed if searchText is not empty
    if (searchText.trim() === "") {
      return; // Prevent search if input is empty
    }

    console.log("Search submitted:", searchText);
    setSearchText(""); // Clear the input after submitting
  };

  return (
    <div className="landing-container">
      <section className="section hero">
        <h1 className="landing-title">Where would you like to eat?</h1>
        <div className="search-container">
          <div className="search-icon-container">
            <img src={SearchIcon} alt="Search Icon" className="search-icon" />
          </div>
          <input
            type="text"
            className="search-bar"
            placeholder="Search restaurants, cuisine..."
            value={searchText}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          <CustomButton
            text="Search"
            onClick={handleSearch}
            className="search-button"
          />
        </div>
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
          the background here should the
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
