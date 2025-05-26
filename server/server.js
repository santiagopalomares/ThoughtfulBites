const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const corsOptions = {
  origin: ["http://localhost:5173"],
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/api", (req, res) => {
  res.json({ example: ["data1", "data2", "data3"] });
});

app.get("/api/restaurants", async (req, res) => {
  const { food, location } = req.query;

  if (!food || !location) {
    return res
      .status(400)
      .json({ error: "Food type and location are required" });
  }

  try {
    const query = `${food} restaurants near ${location}`;
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
      query
    )}&key=${process.env.GOOGLE_PLACES_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "OK") {
      const restaurants = data.results.map((place) => ({
        name: place.name,
        address: place.formatted_address,
        rating: place.rating,
        priceLevel: place.price_level,
        isOpen: place.opening_hours?.open_now,
        photoUrl: place.photos?.[0]
          ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${process.env.GOOGLE_PLACES_API_KEY}`
          : null,
      }));

      res.json({ restaurants });
    } else {
      res.status(500).json({ error: "Failed to fetch restaurants" });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(8080, () => {
  console.log("Server started on port 8080");
});
