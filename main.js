const express = require("express");
const app = express();
const port = 6969;

app.get("/", (req, res) => {
  res.send("ExpressCURD");
});

app.listen(port, () => {
  console.log(`Catch me @ http://localhost:${port}`);
});
