const { mapImage } = require("../utility/imageManager");

const mapUser = (user) => {
  user.avatar = mapImage(user.avatar);
  user.coverPhoto = mapImage(user.coverPhoto);
  user.password = "";

  return user;
};

const mapUsers = (users) => users.map(mapUser);

module.exports = { mapUser, mapUsers };
