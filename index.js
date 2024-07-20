const winston = require("winston");
const express = require("express");

let server;

function initializeServer() {
  if (server) return server;

  const app = express();

  require("./startup/logging");
  require("./startup/routes")(app);
  require("./startup/db")();
  require("./startup/config")();
  require("./startup/validation")();
  require("./startup/prod")(app);

  const port = process.env.PORT || 3000;
  server = app.listen(port, () =>
    winston.info(`Listening on port ${port}...`)
  );

  return server;
}

module.exports = initializeServer;
