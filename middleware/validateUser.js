const { User } = require("../models/user");

module.exports = async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) return res.status(400).send({ error: "Invalid user" });

  next();
};
