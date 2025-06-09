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

const menuCache = new Map();

app.get("/api", (req, res) => {
  res.json({ example: ["data1", "data2", "data3"] });
});

app.post("/api/signup", async (req, res) => {
  const { email, password, userDietTypes, userDietDetails } = req.body;
  try {
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

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (users.length === 0) {
      return res.status(400).json({ message: "Email not found." });
    }

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
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng,
      }));

      res.json({ restaurants });
    } else {
      res.status(500).json({ error: "Failed to fetch restaurants" });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/menu/:restaurantName", async (req, res) => {
  const { restaurantName } = req.params;

  if (menuCache.has(restaurantName)) {
    console.log(`Returning cached menu for ${restaurantName}`);
    return res.json(menuCache.get(restaurantName));
  }

  try {
    console.log(`Generating new menu for ${restaurantName}...`);
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Generate a realistic menu for a restaurant called "${restaurantName}". Return exactly 12-15 menu items in this JSON format:
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
      temperature: 0.3,
    });

    const menuData = JSON.parse(completion.choices[0].message.content);

    menuCache.set(restaurantName, menuData);
    console.log(`Generated and cached menu for ${restaurantName}`);

    res.json(menuData);
  } catch (error) {
    console.error("Error generating menu:", error);
    res.status(500).json({ error: "Failed to generate menu" });
  }
});

app.get("/api/user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const [users] = await pool.query(
        "SELECT user_id, email FROM users WHERE user_id = ?",
        [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = users[0];

    const [restrictions] = await pool.query(
        "SELECT restriction_type, custom_items FROM dietary_restrictions WHERE user_id = ?",
        [userId]
    );

    const dietaryRestrictions = restrictions.map((restriction) => ({
      type: restriction.restriction_type,
      customItems: restriction.custom_items
          ? restriction.custom_items.split(",")
          : null,
    }));

    res.json({
      userId: user.user_id,
      email: user.email,
      dietaryRestrictions: dietaryRestrictions,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.put("/api/user/:userId", async (req, res) => {
  const { userId } = req.params;
  const { email, password } = req.body;

  try {
    const [existingUser] = await pool.query(
        "SELECT * FROM users WHERE user_id = ?",
        [userId]
    );

    if (existingUser.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    let updateQuery = "UPDATE users SET email = ?";
    let updateParams = [email];

    if (password && password !== "••••••••••••") {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateQuery += ", password_hash = ?";
      updateParams.push(hashedPassword);
    }

    updateQuery += " WHERE user_id = ?";
    updateParams.push(userId);

    await pool.query(updateQuery, updateParams);

    res.json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.put("/api/user/:userId/dietary-restrictions", async (req, res) => {
  const { userId } = req.params;
  const { dietRestrictions } = req.body;

  try {
    const [existingUser] = await pool.query(
        "SELECT * FROM users WHERE user_id = ?",
        [userId]
    );

    if (existingUser.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const [existingRestrictions] = await pool.query(
        "SELECT restriction_type, custom_items FROM dietary_restrictions WHERE user_id = ? AND restriction_type IN ('Allergens', 'Other')",
        [userId]
    );

    const existingCustomItems = {};
    existingRestrictions.forEach((restriction) => {
      existingCustomItems[restriction.restriction_type] =
          restriction.custom_items;
    });

    await pool.query("DELETE FROM dietary_restrictions WHERE user_id = ?", [
      userId,
    ]);

    const restrictionTypes = {
      allergen: "Allergens",
      dairyfree: "Dairy-Free",
      glutenfree: "Gluten-Free",
      pescatarian: "Pescatarian",
      vegan: "Vegan",
      vegetarian: "Vegetarian",
      other: "Other",
      none: "None",
    };

    for (const [key, checked] of Object.entries(dietRestrictions)) {
      if (checked) {
        const restrictionType = restrictionTypes[key];

        let customItems = null;
        if (
            restrictionType === "Allergens" &&
            existingCustomItems["Allergens"]
        ) {
          customItems = existingCustomItems["Allergens"];
        } else if (
            restrictionType === "Other" &&
            existingCustomItems["Other"]
        ) {
          customItems = existingCustomItems["Other"];
        }

        await pool.query(
            "INSERT INTO dietary_restrictions (user_id, restriction_type, custom_items) VALUES (?, ?, ?)",
            [userId, restrictionType, customItems]
        );
      }
    }

    res.json({ message: "Dietary restrictions updated successfully" });
  } catch (error) {
    console.error("Error updating dietary restrictions:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.put("/api/user/:userId/dietary-details", async (req, res) => {
  const { userId } = req.params;
  const { dietaryDetails } = req.body;

  try {
    const [existingUser] = await pool.query(
        "SELECT * FROM users WHERE user_id = ?",
        [userId]
    );

    if (existingUser.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const allergenItems = dietaryDetails
        .filter((item) => item.type === "allergen")
        .map((item) => item.name);

    const otherItems = dietaryDetails
        .filter((item) => item.type === "other")
        .map((item) => item.name);

    if (allergenItems.length > 0) {
      const [existingAllergen] = await pool.query(
          "SELECT * FROM dietary_restrictions WHERE user_id = ? AND restriction_type = 'Allergens'",
          [userId]
      );

      if (existingAllergen.length > 0) {
        await pool.query(
            "UPDATE dietary_restrictions SET custom_items = ? WHERE user_id = ? AND restriction_type = 'Allergens'",
            [allergenItems.join(","), userId]
        );
      } else {
        await pool.query(
            "INSERT INTO dietary_restrictions (user_id, restriction_type, custom_items) VALUES (?, ?, ?)",
            [userId, "Allergens", allergenItems.join(",")]
        );
      }
    } else {
      await pool.query(
          "DELETE FROM dietary_restrictions WHERE user_id = ? AND restriction_type = 'Allergens'",
          [userId]
      );
    }

    if (otherItems.length > 0) {
      const [existingOther] = await pool.query(
          "SELECT * FROM dietary_restrictions WHERE user_id = ? AND restriction_type = 'Other'",
          [userId]
      );

      if (existingOther.length > 0) {
        await pool.query(
            "UPDATE dietary_restrictions SET custom_items = ? WHERE user_id = ? AND restriction_type = 'Other'",
            [otherItems.join(","), userId]
        );
      } else {
        await pool.query(
            "INSERT INTO dietary_restrictions (user_id, restriction_type, custom_items) VALUES (?, ?, ?)",
            [userId, "Other", otherItems.join(",")]
        );
      }
    } else {
      await pool.query(
          "DELETE FROM dietary_restrictions WHERE user_id = ? AND restriction_type = 'Other'",
          [userId]
      );
    }

    res.json({ message: "Dietary details updated successfully" });
  } catch (error) {
    console.error("Error updating dietary details:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete user account
app.delete("/api/user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // Check if user exists
    const [existingUser] = await pool.query(
      "SELECT * FROM users WHERE user_id = ?",
      [userId]
    );

    if (existingUser.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete user (CASCADE will automatically delete dietary_restrictions)
    await pool.query("DELETE FROM users WHERE user_id = ?", [userId]);

    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error deleting user account:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(8080, () => {
  console.log("Server started on port 8080");
});