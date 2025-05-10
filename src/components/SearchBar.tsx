import React, { useState, useEffect, useRef } from "react";
import styles from "./SearchBar.module.css";
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
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 1200);
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
      event.preventDefault();
      handleSearch();
    }
  };

  const handleSearch = () => {
    if (searchText.trim() === "") {
      return;
    }

    onSearch(searchText);
  };

  return (
    <div className={styles["search-container"]}>
      <div className={styles["search-inner-container"]}>
        {searchIconSrc && (
          <div className={styles["search-icon-container"]}>
            <img
              src={searchIconSrc}
              alt="Search Icon"
              className={styles["search-icon"]}
            />
          </div>
        )}
        <input
          type="text"
          className={styles["search-bar"]}
          placeholder={placeholder}
          value={searchText}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          ref={searchInputRef}
        />

        {/* Only show search button on screens 1200px and above */}
        {!isSmallScreen && (
          <div className={styles["search-button-container"]}>
            <CustomButton
              text={buttonText}
              onClick={handleSearch}
              className={styles["search-button"]}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
