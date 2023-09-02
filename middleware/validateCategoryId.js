const getCategory = require("../utility/getCategory");

module.exports = async (req, res, next) => {
  const category = await getCategory(req.body.category);

  if (!category) return res.status(400).send({ error: "Invalid category." });
  req.category = category;

  next();
};
