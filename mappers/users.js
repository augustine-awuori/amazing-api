const { mapImage } = require("./images");
const _ = require("lodash");

const mapAvatar = (avatar) => (avatar ? mapImage(avatar) : undefined);

const mapFollowers = (followers) =>
  followers.map((follower) => {
    follower.avatar = mapAvatar(follower?.avatar);

    return follower;
  });

const mapUser = (user) => {
  user.avatar = mapAvatar(user?.avatar);
  user.coverPhoto = mapAvatar(user?.coverPhoto);
  user.followers = mapFollowers(user.followers);
  user.following = mapFollowers(user.following);
  user.password = "";

  return user;
};

module.exports = { mapUser };
