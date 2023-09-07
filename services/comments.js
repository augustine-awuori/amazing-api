const { isValidObjectId } = require("mongoose");

const { Comment } = require("../models/comment");
const { mapItem, mapItems } = require("../mappers/items");

const create = async (postId, text) => {
  const comment = new Comment({ text, postId });

  await comment.save();

  return mapItem(comment);
};

const deleteComment = async (commentId) =>
  mapItem(await Comment.findByIdAndDelete(commentId));

const getPostComments = async (postId) => {
  const comments = await Comment.find({ postId });

  return mapItems(comments);
};

const update = async (commentId, text) => {
  if (!isValidObjectId(commentId)) return;

  const updated = await Comment.findByIdAndUpdate(
    commentId,
    { $set: { text, edited: true } },
    { new: true }
  );

  return mapItem(updated);
};

module.exports = { create, delete: deleteComment, getPostComments, update };
