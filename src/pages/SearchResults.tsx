import React, { useState, useEffect, useRef } from "react";
import "./SearchResults.css";
import SearchBar from "../components/SearchBar";
import SearchIcon from "../assets/SearchIcon.png";
import { useNavigate } from "react-router-dom";

interface SearchResult {
  id: string;
  image: string;
  title: string;
  bulletPoints: string[];
}

const SearchResults: React.FC = () => {
  const navigate = useNavigate();

  const initialResults: SearchResult[] = [
    {
      id: "nobu",
      image: "https://via.placeholder.com/100",
      title: "Nobu: Japanese Fusion",
      bulletPoints: [
        "Black Cod with Miso",
        "Yellowtail Sashimi with Jalapeño",
        "Rock Shrimp Tempura",
      ],
    },
    {
      id: "french-laundry",
      image: "https://via.placeholder.com/100",
      title: "The French Laundry: Fine Dining",
      bulletPoints: [
        "Oysters and Pearls",
        "Butter-Poached Lobster",
        "Seasonal Tasting Menu",
      ],
    },
    {
      id: "shake-shack",
      image: "https://via.placeholder.com/100",
      title: "Shake Shack: Gourmet Fast Food",
      bulletPoints: ["ShackBurger", "Cheese Fries", "Chocolate Shake"],
    },
    {
      id: "le-bernardin",
      image: "https://via.placeholder.com/100",
      title: "Le Bernardin: Seafood",
      bulletPoints: [
        "Lacquered Lobster Tail",
        "Barely Cooked Scallop",
        "Poached Halibut",
      ],
    },
    {
      id: "momofuku",
      image: "https://via.placeholder.com/100",
      title: "Momofuku: Asian Fusion",
      bulletPoints: [
        "Pork Belly Buns",
        "Spicy Cold Noodles",
        "Fried Chicken Feast",
      ],
    },
    {
      id: "alinea",
      image: "https://via.placeholder.com/100",
      title: "Alinea: Molecular Gastronomy",
      bulletPoints: [
        "Edible Balloon",
        "Black Truffle Explosion",
        "Tabletop Dessert",
      ],
    },
    {
      id: "in-n-out",
      image: "https://via.placeholder.com/100",
      title: "In-N-Out Burger: Fast Food Classic",
      bulletPoints: ["Double-Double", "Animal Style Fries", "Neapolitan Shake"],
    },
    {
      id: "eleven-madison",
      image: "https://via.placeholder.com/100",
      title: "Eleven Madison Park: Fine Dining",
      bulletPoints: [
        "Honey Lavender Duck",
        "Milk & Honey",
        "Plant-Based Tasting Menu",
      ],
    },
    {
      id: "osteria",
      image: "https://via.placeholder.com/100",
      title: "Osteria Francescana: Italian",
      bulletPoints: [
        "Five Ages of Parmigiano Reggiano",
        "The Crunchy Part of Lasagna",
        "Oops! I Dropped the Lemon Tart",
      ],
    },
    {
      id: "noma",
      image: "https://via.placeholder.com/100",
      title: "Noma: Nordic Cuisine",
      bulletPoints: ["Moss and Cep", "Mahogany Clam", "Vegetable Season Menu"],
    },
  ];

  const [results, setResults] = useState<SearchResult[]>(initialResults);
  const [leftWidth, setLeftWidth] = useState<number>(50);
  const [rightWidth, setRightWidth] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isWideScreen, setIsWideScreen] = useState<boolean>(
    window.innerWidth > 1024
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const resizerRef = useRef<HTMLDivElement>(null);

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

  const handleSearch = (searchQuery: string) => {
    console.log("Searching for:", searchQuery);

    if (searchQuery.trim() === "") {
      setResults(initialResults);
      if (document.querySelector(".search-results")) {
        document.querySelector(".search-results")!.scrollTop = 0;
      }
      return;
    }

    const filteredResults = initialResults.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.bulletPoints.some((point) =>
          point.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    setResults(filteredResults);

    if (document.querySelector(".search-results")) {
      document.querySelector(".search-results")!.scrollTop = 0;
    }

    if (window.innerWidth <= 768) {
      (document.activeElement as HTMLElement)?.blur();
    }
  };

  const handleResultClick = (resultId: string) => {
    // Navigate to the menu options page with the result ID
    navigate(`/menu-options/${resultId}`);
  };

  return (
    <div className="search-results-page">
      <div className="results-search-container">
        <div className="search-container">
          <SearchBar
            placeholder={
              window.innerWidth <= 480 ? "Search..." : "Filter results..."
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
          {results.length > 0 ? (
            <>
              {results.map((item, index) => (
                <div
                  className="result-item"
                  key={index}
                  onClick={() => handleResultClick(item.id)}
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
              No results found. Try a different search term.
            </div>
          )}
        </div>

        {isWideScreen && <div className="resizer" ref={resizerRef}></div>}

        {isWideScreen && (
          <div className="right-section" style={{ width: `${rightWidth}%` }}>
            <div className="gray-box"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
