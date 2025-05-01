import React, { useState, useEffect } from "react";
import "./SearchBar.css";
import CustomButton from "./Button";

interface SearchBarProps {
  placeholder?: string;
  onSearch: (searchQuery: string) => void;
  buttonText?: string;
  searchIconSrc?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search for restaurants, cuisines, ...",
  onSearch,
  buttonText = "Search",
  searchIconSrc,
}) => {
  const [searchText, setSearchText] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleSearch = () => {
    if (searchText.trim() === "") {
      return;
    }

    onSearch(searchText);
    setSearchText("");
  };

  return (
    <div className="search-container">
      {searchIconSrc && (
        <div className="search-icon-container">
          <img src={searchIconSrc} alt="Search Icon" className="search-icon" />
        </div>
      )}
      <input
        type="text"
        className="search-bar"
        placeholder={placeholder}
        value={searchText}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
      <CustomButton
        text={buttonText}
        onClick={handleSearch}
        className="search-button"
      />
    </div>
  );
};

export default SearchBar;
