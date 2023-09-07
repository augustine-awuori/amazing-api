const { isValidObjectId } = require("mongoose");

const { mapPosts, mapPost } = require("../mappers/posts");
const { populateAndProject } = require("./main");
const { Post } = require("../models/post");

const getAll = async (filter = {}) =>
  mapPosts(await populateAndProject(Post.find(filter).sort("-_id")));

const findById = async (postId) => {
  if (!isValidObjectId(postId))
    return mapPost(await populateAndProject(Post.findById(postId)));
};

const findByIdAndUpdate = async (id, update, options) => {
  if (!isValidObjectId(id)) return;

  const post = await populateAndProject(
    Post.findByIdAndUpdate(id, update, options)
  );

  return mapPost(post);
};

const findByIdAndDelete = async (id) => {
  if (isValidObjectId(id)) return mapPost(await Post.findByIdAndDelete(id));
};

module.exports = { findByIdAndDelete, findByIdAndUpdate, getAll, findById };
