const { isValidObjectId } = require("mongoose");

const { Comment } = require("../models/comment");

const populateAndProject = (query) => query.populate("author", "-password");

const getAll = async (filter = {}) => {
  const comments = await populateAndProject(Comment.find(filter).sort("-_id"));

  return comments;
};

const findById = async (postId) =>
  await populateAndProject(Comment.findById(postId));

const findByIdAndUpdate = async (id, update, options) => {
  if (!isValidObjectId(id)) return;

  return await populateAndProject(
    Comment.findByIdAndUpdate(id, update, options)
  );
};

module.exports = { findByIdAndUpdate, getAll, findById };
