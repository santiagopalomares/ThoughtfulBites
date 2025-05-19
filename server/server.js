const express = require("express");
const cors = require("cors");

const app = express();
const corsOptions = {
  origin: ["http://localhost:5173"],
};

app.use(cors(corsOptions));

app.use(express.json());

app.get("/api", (req, res) => {
  res.json({ example: ["data1", "data2", "data3"] });
});

app.listen(8080, () => {
  console.log("Server started on port 8080");
});
