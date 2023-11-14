const cors = require("cors");
const express = require("express");
const serveStatic = require("serve-static");

const auth = require("../routes/auth");
const categories = require("../routes/categories");
const error = require("../middleware/error");
const expoPushTokens = require("../routes/expoPushTokens");
const listings = require("../routes/listings");
const opinions = require("../routes/opinions");
const orders = require("../routes/orders");
const posts = require("../routes/posts");
const products = require("../routes/products");
const requests = require("../routes/requests");
const shops = require("../routes/shops");
const types = require("../routes/types");
const users = require("../routes/users");

module.exports = function (app) {
  app.use(express.json());
  app.use(serveStatic("public", { acceptRanges: false }));
  app.use(cors({ origin: "*" }));
  app.use("/api/auth", auth);
  app.use("/api/categories", categories);
  app.use("/api/listings", listings);
  app.use("/api/opinions", opinions);
  app.use("/api/orders", orders);
  app.use("/api/posts", posts);
  app.use("/api/products", products);
  app.use("/api/requests", requests);
  app.use("/api/shops", shops);
  app.use("/api/types", types);
  app.use("/api/users", users);
  app.use("/api/expoPushTokens", expoPushTokens);
  app.use(error);
};
