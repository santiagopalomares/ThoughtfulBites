import React, { useState, useEffect, useRef } from "react";
import styles from "./SearchResults.module.css";
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
  lat: number;
  lng: number;
}

interface CachedSearch {
  query: string;
  results: SearchResult[];
  timestamp: number;
}

const SearchResults: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);
  const [lastSuccessfulSearch, setLastSuccessfulSearch] =
    useState<CachedSearch | null>(null);

  // Debug logging
  useEffect(() => {
    console.log("lastSuccessfulSearch updated:", lastSuccessfulSearch);
    console.log("isOffline:", isOffline);
    console.log("current results length:", results.length);
  }, [lastSuccessfulSearch, isOffline, results]);
  const [leftWidth, setLeftWidth] = useState<number>(50);
  const [rightWidth, setRightWidth] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isWideScreen, setIsWideScreen] = useState<boolean>(
    window.innerWidth > 1024
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const resizerRef = useRef<HTMLDivElement>(null);

  // Monitor online/offline status and handle cached results
  useEffect(() => {
    const handleOnline = () => {
      console.log("Going online");
      setIsOffline(false);
    };

    const handleOffline = () => {
      console.log("Going offline");
      console.log(
        "lastSuccessfulSearch when going offline:",
        lastSuccessfulSearch
      );
      setIsOffline(true);

      // When going offline, show last successful search if available
      if (lastSuccessfulSearch && lastSuccessfulSearch.results.length > 0) {
        console.log("Setting cached results when going offline");
        setResults(lastSuccessfulSearch.results);
      } else {
        console.log("No cached results to show when going offline");
      }
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [lastSuccessfulSearch]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const query = urlParams.get("query");

    if (query) {
      // First check if we have cached results in sessionStorage for this query
      const cachedData = sessionStorage.getItem(`search_${query}`);
      if (cachedData) {
        try {
          const parsed = JSON.parse(cachedData);
          const isExpired = Date.now() - parsed.timestamp > 10 * 60 * 1000; // 10 minutes
          if (!isExpired) {
            console.log("Loading cached results from sessionStorage");
            setResults(parsed.results);
            setLastSuccessfulSearch(parsed);
            return; // Don't make API call if we have fresh cached data
          }
        } catch (e) {
          console.error("Error parsing cached data:", e);
        }
      }

      // Only make API call if no valid cache
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
          `.${styles["results-search-container"]}`
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

    // Check if we're offline
    if (isOffline) {
      if (
        lastSuccessfulSearch &&
        lastSuccessfulSearch.query.toLowerCase() === searchQuery.toLowerCase()
      ) {
        console.log("Using cached results due to offline status");
        setResults(lastSuccessfulSearch.results);
        return;
      } else if (lastSuccessfulSearch) {
        // Show the last successful search even if query doesn't match exactly
        console.log(
          "Showing last successful search results due to offline status"
        );
        setResults(lastSuccessfulSearch.results);
        return;
      } else {
        console.log("Offline with no cached results");
        setResults([]);
        return;
      }
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `https://thoughtful-bites-server.vercel.app/api/restaurants`,
        {
          params: {
            food: searchQuery,
            location: "Irvine, CA",
          },
          timeout: 10000, // 10 second timeout
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
            lat: restaurant.lat,
            lng: restaurant.lng,
          };
        }
      );

      console.log("Mapped results:", apiResults);
      setResults(apiResults);

      // Cache the successful search
      const cacheData = {
        query: searchQuery,
        results: apiResults,
        timestamp: Date.now(),
      };
      console.log("Caching search data:", cacheData);
      setLastSuccessfulSearch(cacheData);

      // Also save to sessionStorage for navigation persistence
      sessionStorage.setItem(
        `search_${searchQuery}`,
        JSON.stringify(cacheData)
      );
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      console.log("lastSuccessfulSearch during error:", lastSuccessfulSearch);

      // If there's a network error, try to use cached results
      if (lastSuccessfulSearch && lastSuccessfulSearch.results.length > 0) {
        console.log("Using cached results due to network error");
        setResults(lastSuccessfulSearch.results);
      } else {
        console.log("No cached results available");
        setResults([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResultClick = (_resultId: string, restaurantName: string) => {
    // Save current search state before navigating
    const currentQuery = new URLSearchParams(location.search).get("query");
    if (currentQuery && results.length > 0) {
      const cacheData = {
        query: currentQuery,
        results: results,
        timestamp: Date.now(),
      };
      sessionStorage.setItem(
        `search_${currentQuery}`,
        JSON.stringify(cacheData)
      );
      console.log("Saved current search state before navigation");
    }

    navigate(`/menu-options/${encodeURIComponent(restaurantName)}`);
  };

  const getStatusMessage = () => {
    if (isOffline) {
      if (lastSuccessfulSearch && results.length > 0) {
        const isSameQuery =
          lastSuccessfulSearch.query.toLowerCase() ===
          new URLSearchParams(location.search).get("query")?.toLowerCase();

        if (isSameQuery) {
          return "You're offline. Showing cached results for your search.";
        } else {
          return `You're offline. Showing cached results for "${lastSuccessfulSearch.query}".`;
        }
      }
      return "You're offline. Connect to the internet to search for restaurants.";
    }
    return null;
  };

  return (
    <div className={styles["search-results-page"]}>
      <div className={styles["results-search-container"]}>
        <div className={styles["search-container"]}>
          <SearchBar
            placeholder={
              window.innerWidth <= 480 ? "Search..." : "Search for food..."
            }
            onSearch={handleSearch}
            buttonText={window.innerWidth <= 480 ? "" : "Search"}
            searchIconSrc={SearchIcon}
          />
          {getStatusMessage() && (
            <div
              className={styles["status-message"]}
              style={{
                padding: "8px 16px",
                marginTop: "8px",
                backgroundColor: isOffline ? "#fff3cd" : "#d1ecf1",
                border: `1px solid ${isOffline ? "#ffeaa7" : "#bee5eb"}`,
                borderRadius: "4px",
                color: isOffline ? "#856404" : "#0c5460",
                fontSize: "14px",
              }}
            >
              {getStatusMessage()}
            </div>
          )}
        </div>
      </div>

      <div className={styles["content-container"]} ref={containerRef}>
        <div
          className={styles["search-results"]}
          style={{ width: isWideScreen ? `${leftWidth}%` : "100%" }}
        >
          {loading ? (
            <div className={styles["loading"]}>
              Searching for restaurants...
            </div>
          ) : results.length > 0 ? (
            <>
              {results.map((item, index) => (
                <div
                  className={styles["result-item"]}
                  key={index}
                  onClick={() => handleResultClick(item.id, item.title)}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className={styles["result-image"]}
                  />
                  <div className={styles["result-description"]}>
                    <div className={styles["description-top"]}>
                      {item.title}
                    </div>
                    <ul className={styles["description-bottom"]}>
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
            <div className={styles["no-results"]}>
              {isOffline
                ? "No cached results available. Connect to the internet to search."
                : 'Search for restaurants by food type (e.g., "pizza", "sushi")'}
            </div>
          )}
        </div>

        {isWideScreen && (
          <div className={styles["resizer"]} ref={resizerRef}></div>
        )}

        {isWideScreen && (
          <div
            className={styles["right-section"]}
            style={{ width: `${rightWidth}%` }}
          >
            <MapPanel
              restaurants={results}
              defaultCenter={
                results.length
                  ? { lat: results[0].lat, lng: results[0].lng }
                  : { lat: 33.68, lng: -117.78 }
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
