const express = require("express");
const app = express();
const path = require("node:path");

const indexRouter = require("./routes/indexRouter");

app.use("/", indexRouter);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`My first Express app - listening on port ${PORT}!`);
});
