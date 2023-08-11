const cors = require("cors");
const express = require("express");
const serveStatic = require("serve-static");

const auth = require("../routes/auth");
const categories = require("../routes/categories");
const error = require("../middleware/error");
const expoPushTokens = require("../routes/expoPushTokens");
const listings = require("../routes/listings");
const requests = require("../routes/requests");
const users = require("../routes/users");

module.exports = function (app) {
  app.use(express.json());
  app.use(serveStatic("public", { acceptRanges: false }));
  app.use(cors({ origin: "*" }));
  app.use("/api/auth", auth);
  app.use("/api/categories", categories);
  app.use("/api/listings", listings);
  app.use("/api/requests", requests);
  app.use("/api/users", users);
  app.use("/api/expoPushTokens", expoPushTokens);
  app.use(error);
};
