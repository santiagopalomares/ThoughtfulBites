require("dotenv").config();
const express = require("express");
const cors = require("cors");
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

app.post("/api/signup", async (req, res) => {
  const { email, password } = req.body;
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

    res.status(201).json({
      message: `User: ${email} registered successfully!`,
      userId: result.insertId,
    });
  } catch (error) {
    res.status(500).json({ message: "500 ERROR" });
  }
});

app.get("/api", (req, res) => {
  res.json({ example: ["data1", "data2", "data3"] });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
