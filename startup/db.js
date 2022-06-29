const mongoose = require("mongoose");

module.exports = function () {
  mongoose
    .connect(`mongodb://localhost/${process.env.DB}`)
    .then(() => console.log("Connected to the MongoDB"))
    .catch((err) => console.error("Connection to the MongoDB falied", err));
};
