const getCategory = require("../utility/getCategory");

module.exports = async (req, res, next) => {
  req.category = await getCategory(req.body.categoryId);

  next();
};
