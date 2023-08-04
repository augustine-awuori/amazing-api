require("express-async-errors");
const winston = require("winston");
require("winston-mongodb");
const config = require("config");
const express = require("express");
const app = express();

require("./startup/routes")(app);

new winston.Logger({
  transports: [
    new winston.transports.File({
      handleExceptions: true,
      handleRejections: true,
      filename: "uncaughtExceptions.log",
    }),
  ],
});

process.on("unhandledRejection", (ex) => {
  throw ex;
});

winston.configure({
  transports: [
    new winston.transports.File({ filename: "logfile.log" }),
    new winston.transports.MongoDB({ db: config.get("db"), level: "info" }),
  ],
});

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined!");
  process.exit(1);
}

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
