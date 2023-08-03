const config = require("config");
const compression = require("compression");
const serveStatic = require("serve-static");
const express = require("express");
const app = express();
const cors = require("cors");

const auth = require("./routes/auth");
const categories = require("./routes/categories");
const listings = require("./routes/listings");
const requests = require("./routes/requests");
const users = require("./routes/users");

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined!");
  process.exit(1);
}

app.use(express.json());
app.use(serveStatic("public", { acceptRanges: false }));
app.use(compression());
app.use(cors({ origin: "*" }));
app.use("/api/auth", auth);
app.use("/api/categories", categories);
app.use("/api/listings", listings);
app.use("/api/requests", requests);
app.use("/api/users", users);

require("./startup/db")();

const port = process.env.PORT || 3000;
const server = app
  .listen(port, () => console.log(`Listening on port ${port}...`))
  .on("error", () => {
    process.once("SIGUSR2", () => process.kill(process.pid, "SIGUSR2"));
    process.once("SIGINT", () => process.kill(process.pid, "SIGINT"));
    process.once("uncaughtException", () => {});
  });

module.exports = server;
