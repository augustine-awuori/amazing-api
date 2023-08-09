const { isValidObjectId } = require("mongoose");

const { Listing } = require("../models/listing");
const { mapListings, mapListing } = require("../mappers/listings");
const { populateAndProject } = require("./main");

const getAll = async (filter = {}) => {
  const listings = await populateAndProject(Listing.find(filter).sort("-_id"));

  return mapListings(listings);
};

const findById = async (listingId) => {
  const listing = await populateAndProject(Listing.findById(listingId));

  return mapListing(listing);
};

const findByIdAndUpdate = async (id, update, options) => {
  if (!isValidObjectId(id)) return;

  const listing = await populateAndProject(
    Listing.findByIdAndUpdate(id, update, options)
  );

  return mapListing(listing);
};

module.exports = { findByIdAndUpdate, getAll, findById };
