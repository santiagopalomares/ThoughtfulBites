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
  const [isMobile, setIsMobile] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isExpanded &&
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const handleInputFocus = () => {
    if (isMobile) {
      setIsExpanded(true);
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 100);
    }
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
    setIsExpanded(false);
  };

  const handleCloseSearch = () => {
    setIsExpanded(false);
  };

  const containerClassName = isExpanded
    ? `${styles["search-container"]} ${styles.expanded}`
    : styles["search-container"];

  return (
    <div className={containerClassName} ref={searchContainerRef}>
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
          onFocus={handleInputFocus}
          ref={searchInputRef}
        />
        <div className={styles["search-button-container"]}>
          <CustomButton
            text={buttonText}
            onClick={handleSearch}
            className={styles["search-button"]}
          />
        </div>
      </div>

      {isMobile && isExpanded && (
        <button
          className={styles["close-search"]}
          onClick={handleCloseSearch}
          aria-label="Close search"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default SearchBar;
