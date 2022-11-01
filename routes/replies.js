const express = require("express");
const router = express.Router();
const _ = require("lodash");

const { mapReply, mapReplies } = require("../mappers/replies");
const { Reply } = require("../models/reply");
const { User } = require("../models/user");
const auth = require("../middleware/auth");
const commentExists = require("../middleware/checkCommentExistence");
const replyExists = require("../middleware/checkReplyExistence");

router.post("/", [auth, commentExists], async (req, res) => {
  const comment = req.comment;

  const reply = new Reply({
    author: await getAuthor(req),
    commentId: req.body.commentId,
    message: req.body.message,
  });
  if (!comment.repliesAuthorsId) comment.repliesAuthorsId = {};
  comment.repliesAuthorsId[req.user._id.toString()] = req.user._id.toString();
  comment.repliesCount += 1;

  comment.save();
  await reply.save();

  res.send(mapReply(reply));
});

router.get("/:id", async (req, res) => {
  const replies = await Reply.find({ commentId: req.params.id }).sort("-_id");

  res.send(mapReplies(replies));
});

router.patch("/:id", [auth, replyExists], async (req, res) => {
  const reply = req.reply;
  const index = reply.likes.findIndex(
    (a) => a._id.toString() === req.user._id.toString()
  );

  if (exists(index)) reply.likes.splice(index, 1);
  else reply.likes.unshift(await getAuthor(req));

  await reply.save();

  res.send(mapReply(reply));
});

function exists(index) {
  return index !== -1;
}

async function getAuthor(req) {
  const user = await User.findById(req.user._id);

  return _.pick(user, ["_id", "avatar", "name", "username"]);
}

module.exports = router;
