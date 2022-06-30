const mongoose = require("mongoose");

module.exports = function () {
  mongoose
    .connect(`mongodb://localhost/${process.env.DB}`)
    .then(() => console.log(`Connected to the ${process.env.DB} DB`))
    .catch((err) =>
      console.error(`Connection to the ${process.env.DB} db failed`, err)
    );
};
