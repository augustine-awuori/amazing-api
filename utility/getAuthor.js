const _ = require("lodash");
const { User } = require("../models/user");

module.exports = async function getAuthor(req) {
  const user = await User.findById(req.user._id);

  return _.pick(user, ["_id", "avatar", "name", "username"]);
};
