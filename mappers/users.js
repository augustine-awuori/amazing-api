const { mapAuthorImages } = require("../utility/imageManager");

const mapUser = (user) => {
  user = mapAuthorImages(user);
  user.password = "";

  return user;
};

const mapUsers = (users) => users.map(mapUser);

module.exports = { mapUser, mapUsers };
