const service = require("../services/posts");

module.exports = async (req, _res, next) => {
  const post = await service.findById(req.params.id);

  req.post = post;

  next();
};
