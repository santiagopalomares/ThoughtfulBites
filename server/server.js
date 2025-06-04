require("dotenv").config();
const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");

const app = express();
const corsOptions = {
  origin: ["http://localhost:5173"],
};

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

app.use(cors(corsOptions));
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
});

app.get("/api", (req, res) => {
  res.json({ example: ["data1", "data2", "data3"] });
});

// Handles signup
app.post("/api/signup", async (req, res) => {
  const { email, password, userDietTypes, userDietDetails } = req.body;
  try {
    // Checks if user exists already, if not, then they will be added to the database
    const [existingUser] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      return res
        .status(400)
        .json({ message: `Email: ${email} has already been registered` });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      "INSERT INTO users (email, password_hash) VALUES (?, ?)",
      [email, hashedPassword]
    );

    // Adds the user's dietary restriction information
    for (const restrictionType of userDietTypes) {
      const custom_items =
        restrictionType === "Allergens" || restrictionType === "Other"
          ? userDietDetails.join(",")
          : null;

      await pool.query(
        "INSERT INTO dietary_restrictions (user_id, restriction_type, custom_items) VALUES (?, ?, ?)",
        [result.insertId, restrictionType, custom_items]
      );
    }

    res.status(201).json({
      message: `User: ${email} registered successfully!`,
      userId: result.insertId,
    });
  } catch (error) {
    res.status(500).json({ message: "500 ERROR" });
  }
});

// Handles login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if user exists
    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (users.length === 0) {
      return res.status(400).json({ message: "Email not found." });
    }

    // Checks if entered password matches
    const existingUser = users[0];
    const isPasswordMatch = await bcrypt.compare(
      password,
      existingUser.password_hash
    );

    if (isPasswordMatch) {
      res.status(201).json({
        message: `User: ${email} logged in successfully!`,
        userId: existingUser.user_id,
      });
    } else {
      res.status(400).json({ message: "Password does not match" });
    }
  } catch (error) {
    res.status(500).json({ message: `${error}` });
  }
});

// Handles searching for restaurants
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

        // Geometry Coordinates for Maps
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng
      }));

      res.json({ restaurants });
    } else {
      res.status(500).json({ error: "Failed to fetch restaurants" });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Handles menu items grabbing for restaurant
app.get("/api/menu/:restaurantName", async (req, res) => {
  const { restaurantName } = req.params;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Generate a realistic menu for a restaurant called "${restaurantName}". Return exactly 8-12 menu items in this JSON format:
       {
         "menu": [
           {
             "name": "Item Name",
             "price": "$12.99",
             "description": "Brief description",
             "category": "appetizer/main/dessert/drink"
           }
         ]
       }
       Make the items realistic for this type of restaurant. Include a mix of categories.`,
        },
      ],
      temperature: 0.7,
    });

    const menuData = JSON.parse(completion.choices[0].message.content);
    res.json(menuData);
  } catch (error) {
    console.error("Error generating menu:", error);
    res.status(500).json({ error: "Failed to generate menu" });
  }
});

app.listen(8080, () => {
  console.log("Server started on port 8080");
});
