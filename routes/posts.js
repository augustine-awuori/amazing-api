const express = require("express");
const router = express.Router();
const multer = require("multer");
const _ = require("lodash");

const { Comment } = require("../models/comment");
const { imageMapper, mapImage } = require("../mappers/images");
const {
  mapPostComment,
  mapPostsComments,
  mapPostsImages,
} = require("../mappers/posts");
const { Post } = require("../models/post");
const { Reply } = require("../models/reply");
const auth = require("../middleware/auth");
const checkPostExistence = require("../middleware/checkPostExistence");
const imageResize = require("../middleware/imageResize");
const imagesResize = require("../middleware/imagesResize");
const validatePost = require("../middleware/validatePost");
const validateUser = require("../middleware/validateUser");

const upload = multer({
  dest: "uploads",
  limits: { fieldSize: 25 * 1024 * 1024 },
});

router.post(
  "/",
  [auth, upload.array("images"), validateUser, imagesResize, validatePost],
  async (req, res) => {
    delete req.user.aboutMe;
    let post = new Post({ author: req.user, message: req.body.message });
    post.images = req.images.map((fileName) => ({ fileName }));

    await post.save();

    res.send(imageMapper(post));
  }
);

router.get("/", async (req, res) => {
  const posts = await Post.find({}).sort("-_id");

  const resources = mapPostsComments(posts.map(imageMapper));
  // const resources = mapPostsImages(posts);
  res.send(resources);
});

router.patch(
  "/:id",
  [
    upload.single("avatar"),
    imageResize,
    auth,
    validateUser,
    checkPostExistence,
  ],
  async (req, res) => {
    const { isAboutLiking, isAboutCommenting, isAboutReplying } = req.body;
    let result;

    if (isAboutLiking === "true") {
      result = await handleLike(req);
    } else if (isAboutCommenting === "true") {
      if (isAboutReplying === "true") {
        result = await handleReply(req);
      } else {
        result = await handleComment(req);
      }
    }

    // TODO: Find out why response always send undefined
    res.send(result);
  }
);

async function handleReply(req, res) {
  const reply = new Reply({
    author: _.pick(req.user, ["_id", "avatar", "name", "username"]),
    message: req.body.message,
  });
  const post = req.post;

  const index = post.comments.findIndex(
    (c) => c._id.valueOf() === req.body.commentId
  );
  if (index < 0) return;
  post.comments[index].replies.unshift(reply);
  if (reply.author.avatar) reply.author.avatar = mapImage(reply.author);
  await post.save();

  return reply;
}

async function handleComment(req) {
  let comment = new Comment({
    author: _.pick(req.user, ["_id", "avatar", "name", "username"]),
    message: req.body.message,
  });
  const post = req.post;
  if (req.image) comment.image = req.image;
  post.comments.unshift(comment);

  await post.save();

  return mapPostComment(comment);
}

async function handleLike(req) {
  const userId = req.user._id.valueOf();
  const post = req.post;

  const index = post.likes.findIndex((lover) => lover._id.valueOf() === userId);
  if (isLiking(index)) {
    post.likes = [req.user, ...post.likes];
    if (!post.likesAuthorsId) post.likesAuthorsId = {};
    post.likesAuthorsId[userId] = userId;
  } else {
    post.likes.splice(index, 1);
    const loversId = { ...post.likesAuthorsId };
    delete loversId[userId];
    post.likesAuthorsId = loversId;
  }

  await post.save();

  return imageMapper(post);
}

function isLiking(index) {
  return index === -1;
}

module.exports = router;
