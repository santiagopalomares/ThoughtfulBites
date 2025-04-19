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
      <h1 className="landing-title">Where would you like to eat?</h1>

      <input
        type="text"
        className="search-bar"
        placeholder="Search restaurants, cuisine..."
        value={searchText}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />

      <section className="section one">
        <h2>Popular Places</h2>
      </section>

      <section className="section two">
        <h2>Recommended For You</h2>
      </section>
    </div>
  );
}
