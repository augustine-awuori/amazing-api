const cors = require("cors");
const express = require("express");
const serveStatic = require("serve-static");

const auth = require("../routes/auth");
const categories = require("../routes/categories");
const chatToken = require("../routes/chatToken");
const error = require("../middleware/error");
const events = require("../routes/events");
const expoPushTokens = require("../routes/expoPushTokens");
const feedToken = require("../routes/feedToken");
const listings = require("../routes/listings");
const mailing = require("../routes/mailing");
const messaging = require("../routes/messaging");
const notifications = require("../routes/notifications");
const opinions = require("../routes/opinions");
const orders = require("../routes/orders");
const posters = require("../routes/posters");
const posts = require("../routes/posts");
const products = require("../routes/products");
const recommendations = require("../routes/recommendations");
const requests = require("../routes/requests");
const services = require("../routes/services");
const shops = require("../routes/shops");
const status = require("../routes/status");
const types = require("../routes/types");
const users = require("../routes/users");
const queries = require("../routes/queries");

module.exports = function (app) {
  app.use(express.json());
  app.use(serveStatic("public", { acceptRanges: false }));
  app.use(cors({ origin: "*" }));
  app.use("/api/auth", auth);
  app.use("/api/categories", categories);
  app.use("/api/events", events);
  app.use("/api/listings", listings);
  app.use("/api/mailing", mailing);
  app.use("/api/messaging", messaging);
  app.use("/api/notifications", notifications);
  app.use("/api/opinions", opinions);
  app.use("/api/orders", orders);
  app.use("/api/posts", posts);
  app.use("/api/posters", posters);
  app.use("/api/products", products);
  app.use("/api/recommendations", recommendations);
  app.use("/api/requests", requests);
  app.use("/api/services", services);
  app.use("/api/shops", shops);
  app.use("/api/status", status);
  app.use("/api/types", types);
  app.use("/api/users", users);
  app.use("/api/chatToken", chatToken);
  app.use("/api/feedToken", feedToken);
  app.use("/api/expoPushTokens", expoPushTokens);
  app.use("/api/queries", queries);
  app.use(error);
};
