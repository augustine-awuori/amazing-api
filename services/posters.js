const { isValidObjectId } = require("mongoose");

const { Poster } = require("../models/poster");

const populateAndProject = (query) => query.populate("author", "-password");

const findById = async (id) => {
  if (!isValidObjectId(id)) return;

  return await populateAndProject(Poster.findById(id));
};

const findAll = async () => {
  const posters = await populateAndProject(Poster.find({}).sort("-_id"));

  return posters;
};

module.exports = { findAll, findById };
