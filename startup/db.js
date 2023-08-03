const config = require("config");
const mongoose = require("mongoose");

const db = config.get("db");

module.exports = function () {
  mongoose
    .connect(db)
    .then(() => console.log(`Connected to the ${db} database`))
    .catch((err) => console.error(`Connection to the ${db} db failed`, err));
};
