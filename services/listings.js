const { isValidObjectId } = require("mongoose");

const { Listing } = require("../models/listing");
const { populateAndProject } = require("./main");

const getAll = async (filter = {}) => {
  const listings = await populateAndProject(Listing.find(filter).sort("-_id"));

  return listings;
};

const findById = async (id) => {
  if (isValidObjectId(id))
    return await populateAndProject(Listing.findById(id));
};

const findByIdAndUpdate = async (id, update, options) => {
  if (isValidObjectId(id))
    return await populateAndProject(
      Listing.findByIdAndUpdate(id, update, options)
    );
};

const findByIdAndDelete = async (id) => {
  if (isValidObjectId(id)) return await Listing.findByIdAndDelete(id);
};

module.exports = {
  findById,
  findByIdAndDelete,
  findByIdAndUpdate,
  getAll,
};
