const config = require("config");
const mongoose = require("mongoose");
const winston = require("winston");

// const db = config.get("db");
const db = "mongodb://localhost:27017/kisii-universe-mart-api";

module.exports = function () {
  mongoose
    .connect(db)
    .then(() => winston.info(`Connected to the ${db} database`));
};
