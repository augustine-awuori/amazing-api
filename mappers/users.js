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

const mapFollowersAndFollowings = (user) => {
  const { ids, result } = mapFollowers(user.followers);
  user.followersId = ids;
  user.followers = result;

  const { ids: followingsId, result: followings } = mapFollowers(
    user.followings
  );
  user.followingsId = followingsId;
  user.followings = followings;

  return user;
};

const mapUser = (user) => {
  user.avatar = mapAvatar(user?.avatar);
  user.coverPhoto = mapAvatar(user?.coverPhoto);
  user.password = "";

  return mapFollowersAndFollowings(user);
};

const mapUsers = (users) => users.map(mapUser);

module.exports = { mapUser, mapUsers };
