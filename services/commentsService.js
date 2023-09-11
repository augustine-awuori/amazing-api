const { isValidObjectId } = require("mongoose");

const { mapComment, mapComments } = require("../mappers/comments");
const { Comment } = require("../models/comment");

const populateAndProject = (query) => query.populate("author", "-password");

const getAll = async (filter = {}) => {
  const comments = await populateAndProject(Comment.find(filter).sort("-_id"));

  return mapComments(comments);
};

const findById = async (postId) => {
  const comment = await populateAndProject(Comment.findById(postId));

  return mapComment(comment);
};

const findByIdAndUpdate = async (id, update, options) => {
  if (!isValidObjectId(id)) return;

  const comment = await populateAndProject(
    Comment.findByIdAndUpdate(id, update, options)
  );

  return mapComment(comment);
};

module.exports = { findByIdAndUpdate, getAll, findById };
