const winston = require("winston");
const express = require("express");
const app = express();
const WebSocketServer = require("ws");
const { createServer } = require("http");

const wss = new WebSocketServer({ server: createServer(app) });

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (message) => {
    console.log("Received:", message);
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

const sendNotification = () => {
  ws.send(
    JSON.stringify({
      title: "Hello!",
      message: "A new notification from the server!",
    })
  );
};

require("./startup/logging");
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/validation")();
require("./startup/prod")(app);

const port = process.env.PORT || 3000;
const server = app.listen(port, () =>
  winston.info(`Listening on port ${port}...`)
);

module.exports = server;
