const { Category } = require("../models/category");

module.exports = async (req, res, next) => {
  const category = await Category.findById(req.body.categoryId);

  if (!category) return res.status(400).send({ error: "Invalid category." });

  next();
};
