const { Category } = require("../models/category");

module.exports = (categoryId) => Category.findById(categoryId);
