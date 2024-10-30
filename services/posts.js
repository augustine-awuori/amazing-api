const { isValidObjectId } = require("mongoose");

const { populateAndProject } = require("./main");
const { Post } = require("../models/post");

const getAll = async (filter = {}) => {
  const posts = await populateAndProject(Post.find(filter).sort("-_id"));

  return posts;
};

const findById = async (postId) => {
  if (!isValidObjectId(postId))
    return await populateAndProject(Post.findById(postId));
};

const findByIdAndUpdate = async (id, update, options) => {
  if (!isValidObjectId(id)) return;

  const post = await populateAndProject(
    Post.findByIdAndUpdate(id, update, options)
  );

  return post;
};

const findByIdAndDelete = async (id) => {
  if (isValidObjectId(id)) return await Post.findByIdAndDelete(id);
};

module.exports = { findByIdAndDelete, findByIdAndUpdate, getAll, findById };
