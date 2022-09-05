const mongoose = require("mongoose");

const db = process.env.DB || "kisii-universe-city-api";

module.exports = function () {
  mongoose
    .connect(`mongodb://localhost/${db}`)
    .then(() => console.log(`Connected to the ${db} database`))
    .catch((err) => console.error(`Connection to the ${db} db failed`, err));
};
