require("express-async-errors");
const winston = require("winston");
require("winston-mongodb");
const config = require("config");
const compression = require("compression");
const serveStatic = require("serve-static");
const express = require("express");
const app = express();
const cors = require("cors");

const auth = require("./routes/auth");
const categories = require("./routes/categories");
const error = require("./middleware/error");
const listings = require("./routes/listings");
const requests = require("./routes/requests");
const users = require("./routes/users");

winston.configure({
  transports: [
    new winston.transports.File({ filename: "logfile.log" }),
    new winston.transports.MongoDB({ db: config.get("db") }),
  ],
});

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
app.use(error);

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
