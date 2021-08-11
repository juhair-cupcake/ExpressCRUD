//initialization
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = process.env.PORT || 6969;

//connect to database
mongoose
  .connect("mongodb://localhost/todo", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((error) => handleError(error));
const db = mongoose.connection;

//Routes
app.get("/", (req, res) => {
  res.send("ExpressCURD");
});

//If database is connected
//Then open server port
db.once("open", function () {
  app.listen(port, () => {
    console.log(`Fire in the hole!!! @ http://localhost:${port}`);
  });
});
//send Error msg for Database
db.on("error", console.error.bind(console, "connection error:"));
