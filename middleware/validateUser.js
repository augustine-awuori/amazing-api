const { User } = require("../models/user");
const _ = require("lodash");

module.exports = async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) return res.status(400).send({ error: "Invalid user" });
  req.user = _.pick(user, [
    "_id",
    "name",
    "username",
    "avatar",
    "aboutMe",
    "coverPhoto",
  ]);

  next();
};
