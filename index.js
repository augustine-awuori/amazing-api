const express = require("express");
const app = express();

const auth = require("./routes/auth");
const categories = require("./routes/categories");
const users = require("./routes/users");
const listings = require("./routes/listings");

app.use(express.json());
app.use("/api/auth", auth);
app.use("/api/users", users);
app.use("/api/listings", listings);
app.use("/api/categories", categories);

require("./startup/db")();
require("./startup/env")();

const port = process.env.PORT || 3000;
const server = app
  .listen(port, () => console.log(`Listening on port ${port}...`))
  .on("error", () => {
    process.once("SIGUSR2", () => process.kill(process.pid, "SIGUSR2"));
    process.once("SIGINT", () => process.kill(process.pid, "SIGINT"));
    process.once("uncaughtException", () => {});
  });
module.exports = server;
