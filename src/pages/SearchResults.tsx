import React, { useState } from "react";
import "./SearchResults.css";
import SearchBar from "../components/SearchBar";
import SearchIcon from "../assets/SearchIcon.png";

interface SearchResult {
  image: string;
  title: string;
  bulletPoints: string[];
}

const SearchResults: React.FC = () => {
  const initialResults: SearchResult[] = [
    {
      image: "https://via.placeholder.com/100",
      title: "Product 1: Smart Watch",
      bulletPoints: [
        "Water resistant",
        "Heart rate monitor",
        "7-day battery life",
      ],
    },
    {
      image: "https://via.placeholder.com/100",
      title: "Product 2: Wireless Earbuds",
      bulletPoints: [
        "Noise cancellation",
        "30-hour battery",
        "Sweat resistant",
      ],
    },
    {
      image: "https://via.placeholder.com/100",
      title: "Product 3: Laptop",
      bulletPoints: ["16GB RAM", "512GB SSD", "14-inch display", "Intel i7"],
    },
    {
      image: "https://via.placeholder.com/100",
      title: "Product 4: Gaming Mouse",
      bulletPoints: ["RGB lighting", "12000 DPI", "8 programmable buttons"],
    },
    {
      image: "https://via.placeholder.com/100",
      title: "Product 5: Mechanical Keyboard",
      bulletPoints: [
        "Cherry MX switches",
        "Customizable lighting",
        "Anti-ghosting",
      ],
    },
    {
      image: "https://via.placeholder.com/100",
      title: "Product 6: External SSD",
      bulletPoints: ["1TB storage", "USB-C connection", "Shock resistant"],
    },
    {
      image: "https://via.placeholder.com/100",
      title: "Product 7: Bluetooth Speaker",
      bulletPoints: ["Waterproof", "20-hour playback", "Built-in microphone"],
    },
    {
      image: "https://via.placeholder.com/100",
      title: "Product 8: Fitness Tracker",
      bulletPoints: [
        "Sleep monitoring",
        "Step counter",
        "Smartphone notifications",
      ],
    },
    {
      image: "https://via.placeholder.com/100",
      title: "Product 9: Webcam",
      bulletPoints: ["1080p resolution", "Auto focus", "Noise-cancelling mic"],
    },
    {
      image: "https://via.placeholder.com/100",
      title: "Product 10: Graphics Card",
      bulletPoints: ["8GB VRAM", "Ray tracing", "4K gaming capability"],
    },
  ];

  const [results, setResults] = useState<SearchResult[]>(initialResults);

  const handleSearch = (searchQuery: string) => {
    console.log("Searching for:", searchQuery);

    if (searchQuery.trim() === "") {
      setResults(initialResults);
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
  };

  return (
    <div className="search-results-page">
      <div className="results-search-container">
        <div className="search-container">
          <SearchBar
            placeholder="Filter results..."
            onSearch={handleSearch}
            buttonText="Search"
            searchIconSrc={SearchIcon}
          />
        </div>
      </div>

      <div className="search-results">
        {results.length > 0 ? (
          results.map((item, index) => (
            <div className="result-item" key={index}>
              <img src={item.image} alt={item.title} className="result-image" />
              <div className="result-description">
                <div className="description-top">{item.title}</div>
                <ul className="description-bottom">
                  {item.bulletPoints.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            No results found. Try a different search term.
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
