const { isValidObjectId } = require("mongoose");

const getCategory = require("../utility/getCategory");

module.exports = async (req, res, next) => {
  const categoryId = req.body.category;
  if (!isValidObjectId(categoryId))
    return res.status(400).send({ error: "Invalid ID" });

  const category = await getCategory(categoryId);

  if (!category) return res.status(400).send({ error: "Invalid category." });
  req.category = category;

  next();
};
