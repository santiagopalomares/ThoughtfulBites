const express = require("express");
const app = express();

app.get("/api", (req, res) => {
  res.json({ example: ["data1", "data2", "data2"] });
});

app.listen(8080, () => {
  console.log("Server started on port 8080");
});
