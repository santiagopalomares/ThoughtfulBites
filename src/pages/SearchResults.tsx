import React from "react";
import "./SearchResults.css";

interface SearchResult {
  image: string;
  title: string;
  bulletPoints: string[];
}

const SearchResults: React.FC = () => {
  // Sample data with 10 entries
  const sampleResults: SearchResult[] = [
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

  return (
    <div className="search-results">
      {sampleResults.map((item, index) => (
        <div className="result-item" key={index}>
          <img src={item.image} alt="Result" className="result-image" />
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
    </div>
  );
};

export default SearchResults;
