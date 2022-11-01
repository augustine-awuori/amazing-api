const multer = require("multer");
const express = require("express");
const router = express.Router();
const _ = require("lodash");

const { Comment } = require("../models/comment");
const { mapComment, mapComments } = require("../mappers/comments");
const { User } = require("../models/user");
const auth = require("../middleware/auth");
const commentExists = require("../middleware/checkCommentExistence");
const imageResize = require("../middleware/imageResize");
const postExists = require("../middleware/checkPostExistence");

const upload = multer({
  dest: "uploads",
  limits: { fieldSize: 25 * 1024 * 1024 },
});

router.post(
  "/",
  [auth, upload.single("image"), postExists, imageResize],
  async (req, res) => {
    const { message, postId } = req.body;
    const post = req.post;

    const comment = new Comment({
      author: await getAuthor(req),
      message,
      postId,
    });
    if (req.image) comment.image = req.image;
    post.commentsCount += 1;

    post.save();
    await comment.save();

    res.send(mapComment(comment));
  }
);

router.get("/:id", async (req, res) => {
  const id = req.params.id;

  const comment = await Comment.findById(id);
  if (comment) return res.send(mapComment(comment));

  const comments = await Comment.find({ postId: id }).sort("-_id");
  res.send(mapComments(comments));
});

router.patch("/:id", [auth, commentExists], async (req, res) => {
  const { isAboutLiking, isAboutDisliking } = req.body;

  if (isAboutLiking) await handleLike(req, res);
  else if (isAboutDisliking) await handleDislike(req, res);
});

async function handleLike(req, res) {
  const comment = req.comment;
  const index = findUserIndex(comment.likes, req);
  const dislikeIndex = findUserIndex(comment.dislikes, req);

  if (exists(dislikeIndex)) comment.dislikes.splice(dislikeIndex, 1);
  if (exists(index)) comment.likes.splice(index, 1);
  else comment.likes.unshift(await getAuthor(req));

  await comment.save();

  res.send(mapComment(comment));
}

async function handleDislike(req, res) {
  const comment = req.comment;
  const likeIndex = findUserIndex(comment.likes, req);
  const index = findUserIndex(comment.dislikes, req);

  if (exists(likeIndex)) comment.likes.splice(likeIndex, 1);
  if (exists(index)) comment.dislikes.splice(index, 1);
  else comment.dislikes.unshift(await getAuthor(req));

  await comment.save();

  res.send(mapComment(comment));
}

function findUserIndex(list, req) {
  return list.findIndex((a) => a._id.toString() === req.user._id.toString());
}

function exists(index) {
  return index !== -1;
}

async function getAuthor(req) {
  const user = await User.findById(req.user._id);

  return _.pick(user, ["_id", "avatar", "name", "username"]);
}

module.exports = router;
