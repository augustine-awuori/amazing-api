const service = require("../services/users");

module.exports = async (req, res, next) => {
  const user = await service.findById(req.user._id);

  if (!user) return res.status(400).send({ error: "Invalid user" });
  req.user = user;

  next();
};
