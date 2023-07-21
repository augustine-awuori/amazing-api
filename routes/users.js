const _ = require("lodash");
const bcrypt = require("bcrypt");
const multer = require("multer");
const express = require("express");
const router = express.Router();

const { imageUnmapper } = require("../mappers/images");
const { mapUser, mapUsers } = require("../mappers/users");
const { User, validate } = require("../models/user");
const { Post } = require("../models/post");
const { Listing } = require("../models/listing");
const auth = require("../middleware/auth");
const avatarResize = require("../middleware/imageResize");
const imagesResize = require("../middleware/imagesResize");
const validateUser = require("../middleware/validateUser");
const validator = require("../middleware/validate");

const upload = multer({ dest: "uploads/" });

router.post(
  "/",
  [upload.single("avatar"), avatarResize, validator(validate)],
  async (req, res) => {
    let user = await User.findOne({ username: req.body.username });
    if (user)
      return res.status(400).send("A user with the username already exist.");

    user = new User(_.pick(req.body, ["name", "username", "password"]));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    if (req.image) user.avatar = req.image;
    user.otherAccounts = { whatsapp: req.body.whatsapp };

    await user.save();

    res
      .header("x-auth-token", user.generateAuthToken())
      .header("access-control-expose-headers", "x-auth-token")
      .send(_.pick(user, ["_id", "name", "username", "isAdmin", "isVerified"]));
  }
);

router.get("/", async (req, res) => {
  const users = await User.find({});

  res.send(mapUsers(users));
});

router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user)
    return res.status(404).send("The user with the given ID does not exist.");

  res.send(mapUser(user));
});

router.patch(
  "/",
  [auth, validateUser, upload.array("images"), imagesResize],
  async (req, res) => {
    const { aboutMe, name, instagram, twitter, whatsapp, username } = req.body;
    const user = await User.findById(req.user._id);

    if (aboutMe) user.aboutMe = aboutMe;
    if (user.username !== username) {
      const userByUsername = await User.findOne({ username });

      if (userByUsername)
        return res.status(400).send("The username is already taken.");
    }
    user.name = name;
    user.username = username;
    user.otherAccounts = { whatsapp, instagram, twitter };

    for (let image of req.files) {
      const name = image.originalname;
      if (user[name]) imageUnmapper(user[name]);
      user[name] = {};
      user[name].fileName = image.filename;
    }

    await updateUserItems(req.user, user);
    await user.save();

    res.send({ token: user.generateAuthToken(), user: mapUser(user) });
  }
);

async function updateUserItems(originalUser, newUser) {
  updateListAuthor(Post, originalUser, newUser);
  updateListAuthor(Listing, originalUser, newUser);
}

async function updateListAuthor(ListModel, originalUser, newUser) {
  const author = pickEssentialProps(originalUser);
  const list = await ListModel.find({ author });
  const updated = pickEssentialProps(newUser);

  list.forEach((item) => {
    item.author = updated;
    item.save();
  });
}

function pickEssentialProps(user) {
  return user
    ? _.pick(user, ["_id", "aboutMe", "avatar", "name", "username"])
    : user;
}

async function handleFollowingsAndFollowers(follower, leaderId) {
  if (!leaderId) return;
  const leader = await User.findById(leaderId);
  if (!leader) return;

  await handleFollowerFollowings(leader, follower);
  return await handleLeaderFollowers(leader, follower);
}

async function handleLeaderFollowers(leader, follower) {
  const index = findIndex(leader.followers, follower);

  if (exists(index)) leader.followers.splice(index, 1);
  else leader.followers.unshift(pickEssentialProps(follower));

  await leader.save();

  return leader;
}

async function handleFollowerFollowings(leader, follower) {
  const index = findIndex(follower.followings, leader);

  if (exists(index)) follower.followings.splice(index, 1);
  else follower.followings.unshift(pickEssentialProps(leader));

  await follower.save();
}

function findIndex(list = [], item) {
  return list.findIndex((i) => i._id.toString() === item._id.toString());
}

function exists(index = -1) {
  return index !== -1;
}

module.exports = router;
