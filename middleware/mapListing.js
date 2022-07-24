const getCategory = require("../utility/getCategory");

module.exports = async (req, res, next) => {
  const { _id: categoryId, label } = await getCategory(req.body.categoryId);
  req.body.category = { _id: categoryId, label };
  delete req.body.categoryId;

  const { _id, name, username } = req.user;
  req.body.author = { _id, name, username };

  next();
};
