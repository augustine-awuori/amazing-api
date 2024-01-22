const { isValidObjectId } = require("mongoose");

const { Comment } = require("../models/comment");

const create = async (postId, text) => {
  const comment = new Comment({ text, postId });

  await comment.save();

  return comment;
};

const deleteComment = async (commentId) =>
  await Comment.findByIdAndDelete(commentId);

const getPostComments = async (postId) => {
  const comments = await Comment.find({ postId });

  return comments;
};

const update = async (commentId, text) => {
  if (!isValidObjectId(commentId)) return;

  return await Comment.findByIdAndUpdate(
    commentId,
    { $set: { text, edited: true } },
    { new: true }
  );
};

module.exports = { create, delete: deleteComment, getPostComments, update };
