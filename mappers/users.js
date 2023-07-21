const { mapImage } = require("./images");
const _ = require("lodash");

const mapAvatar = (avatar) => (avatar ? mapImage(avatar) : avatar);

const mapFollowers = (list = []) => {
  const ids = {};

  const result = [...list].map((follower) => {
    const followerId = follower._id.toString();

    follower.avatar = mapAvatar(follower?.avatar);
    ids[followerId] = followerId;

    return follower;
  });

  return { ids, result };
};

const mapUser = (user) => {
  user.avatar = mapAvatar(user?.avatar);
  user.coverPhoto = mapAvatar(user?.coverPhoto);
  user.password = "";

  return user;
};

const mapUsers = (users) => users.map(mapUser);

module.exports = { mapUser, mapUsers };
