require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

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

app.get("/test-db", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 + 1 AS solution");
    res.json({ result: rows[0].solution });
  } catch (error) {
    console.error("MySQL error:", error);
    res.status(500).json({ error: "Database error" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get("/api", (req, res) => {
  res.json({ example: ["data1", "data2", "data3"] });
});

app.listen(8080, () => {
  console.log("Server started on port 8080");
});
