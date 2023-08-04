const config = require("config");
const express = require("express");
const app = express();

require("./startup/logging");
require("./startup/routes")(app);
require("./startup/db")();

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined!");
  process.exit(1);
}

const port = process.env.PORT || 3000;
const server = app
  .listen(port, () => console.log(`Listening on port ${port}...`))
  .on("error", () => {
    process.once("SIGUSR2", () => process.kill(process.pid, "SIGUSR2"));
    process.once("SIGINT", () => process.kill(process.pid, "SIGINT"));
    process.once("uncaughtException", () => {});
  });

module.exports = server;
