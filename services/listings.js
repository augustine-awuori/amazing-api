const { isValidObjectId } = require("mongoose");

const { Listing } = require("../models/listing");
const { populateAndProject } = require("./main");
const { sendMessageToAllExcept } = require("../utility/whatsapp");

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

const getAlertMessageFor = (listingId) =>
  `Subject: 🚀 New Listing Alert! Check it Out Now!

Hey,

Exciting news! A new listing has just been added to Campus Mart. 🌟 Don't miss out – explore it now!

https://kisiiuniversemart.digital/listings/${listingId}

Happy browsing!
Campus Mart Team`;

const informOthers = (authorId, listingId) => {
  const message = getAlertMessageFor(listingId);

  sendMessageToAllExcept(authorId, message);
};

module.exports = {
  findById,
  findByIdAndDelete,
  findByIdAndUpdate,
  getAll,
  informOthers,
};
