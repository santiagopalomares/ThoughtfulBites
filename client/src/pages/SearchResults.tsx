import React, { useState, useEffect, useRef } from "react";
import "./SearchResults.css";
import SearchBar from "../components/SearchBar";
import SearchIcon from "../assets/SearchIcon.png";
import { useNavigate, useLocation } from "react-router-dom";
import MapPanel from "../components/MapPanel";
import axios from "axios";

interface SearchResult {
  id: string;
  image: string;
  title: string;
  bulletPoints: string[];
  address?: string;
  rating?: number;
  priceLevel?: number;
  isOpen?: boolean;
}

const SearchResults: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [leftWidth, setLeftWidth] = useState<number>(50);
  const [rightWidth, setRightWidth] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isWideScreen, setIsWideScreen] = useState<boolean>(
    window.innerWidth > 1024
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const resizerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const query = urlParams.get("query");
    if (query) {
      handleSearch(query);
    }
  }, [location.search]);

  useEffect(() => {
    const handleResize = () => {
      const newIsWideScreen = window.innerWidth > 1024;
      setIsWideScreen(newIsWideScreen);

      if (!newIsWideScreen) {
        setLeftWidth(100);
        setRightWidth(0);
      } else if (leftWidth === 100) {
        setLeftWidth(50);
        setRightWidth(50);
      }

      if (containerRef.current) {
        const searchContainer = document.querySelector(
          ".results-search-container"
        );
        if (searchContainer) {
          const searchHeight = searchContainer.clientHeight;
          containerRef.current.style.height = `calc(100vh - ${searchHeight}px)`;
        }
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [leftWidth]);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (!isWideScreen) return;
      e.preventDefault();
      setIsDragging(true);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current || !isWideScreen) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const mouseX = e.clientX - containerRect.left;

      let newLeftWidth = (mouseX / containerWidth) * 100;
      newLeftWidth = Math.max(30, Math.min(70, newLeftWidth));
      const newRightWidth = 100 - newLeftWidth;

      setLeftWidth(newLeftWidth);
      setRightWidth(newRightWidth);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    const resizer = resizerRef.current;
    if (resizer) {
      resizer.addEventListener("mousedown", handleMouseDown);
    }

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      if (resizer) {
        resizer.removeEventListener("mousedown", handleMouseDown);
      }
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, isWideScreen]);

  const handleSearch = async (searchQuery: string) => {
    if (searchQuery.trim() === "") {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/restaurants`,
        {
          params: {
            food: searchQuery,
            location: "Irvine, CA",
          },
        }
      );

      console.log("Full API response:", response.data);
      console.log("Restaurants array:", response.data.restaurants);

      if (
        !response.data.restaurants ||
        !Array.isArray(response.data.restaurants)
      ) {
        console.error("No restaurants array found in response");
        setResults([]);
        return;
      }

      const apiResults = response.data.restaurants.map(
        (restaurant: any, index: number) => {
          console.log("Processing restaurant:", restaurant);

          return {
            id: `restaurant-${index}`,
            image: restaurant.photoUrl || "https://via.placeholder.com/100",
            title: restaurant.name,
            bulletPoints: [
              restaurant.address,
              `Rating: ${restaurant.rating || "N/A"}`,
              `Price Level: ${"$".repeat(restaurant.priceLevel || 1)}`,
              restaurant.isOpen !== undefined
                ? restaurant.isOpen
                  ? "Open Now"
                  : "Closed"
                : "Hours Unknown",
            ].filter((point) => point && point.trim() !== ""),
            address: restaurant.address,
            rating: restaurant.rating,
            priceLevel: restaurant.priceLevel,
            isOpen: restaurant.isOpen,
          };
        }
      );

      console.log("Mapped results:", apiResults);
      setResults(apiResults);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleResultClick = (resultId: string, restaurantName: string) => {
    navigate(`/menu-options/${encodeURIComponent(restaurantName)}`);
  };

  return (
    <div className="search-results-page">
      <div className="results-search-container">
        <div className="search-container">
          <SearchBar
            placeholder={
              window.innerWidth <= 480 ? "Search..." : "Search for food..."
            }
            onSearch={handleSearch}
            buttonText={window.innerWidth <= 480 ? "" : "Search"}
            searchIconSrc={SearchIcon}
          />
        </div>
      </div>

      <div className="content-container" ref={containerRef}>
        <div
          className="search-results"
          style={{ width: isWideScreen ? `${leftWidth}%` : "100%" }}
        >
          {loading ? (
            <div className="loading">Searching for restaurants...</div>
          ) : results.length > 0 ? (
            <>
              {results.map((item, index) => (
                <div
                  className="result-item"
                  key={index}
                  onClick={() => handleResultClick(item.id, item.title)}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="result-image"
                  />
                  <div className="result-description">
                    <div className="description-top">{item.title}</div>
                    <ul className="description-bottom">
                      {item.bulletPoints.map((point, idx) => (
                        <li key={idx}>{point}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
              <div style={{ height: "20px" }}></div>
            </>
          ) : (
            <div className="no-results">
              Search for restaurants by food type (e.g., "pizza", "sushi")
            </div>
          )}
        </div>

        {isWideScreen && <div className="resizer" ref={resizerRef}></div>}

        {isWideScreen && (
          <div className="right-section" style={{ width: `${rightWidth}%` }}>
            <MapPanel />
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
