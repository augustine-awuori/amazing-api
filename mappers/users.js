const { mapImage } = require("../utility/imageManager");

const mapAvatar = (avatar) => (avatar ? mapImage(avatar) : avatar);

const mapUser = (user) => {
  user.avatar = mapAvatar(user?.avatar);
  user.coverPhoto = mapAvatar(user?.coverPhoto);
  user.password = "";

  return user;
};

const mapUsers = (users) => users.map(mapUser);

module.exports = { mapUser, mapUsers };
