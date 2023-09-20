const { isValidObjectId } = require("mongoose");

const { Listing } = require("../models/listing");
const { mapListings, mapListing } = require("../mappers/listings");
const { populateAndProject } = require("./main");
const { Shop } = require("../models/shop");
const { mapShop, mapShops } = require("../mappers/shops");

const getAll = async (filter = {}) => {
  const shops = await populateAndProject(Shop.find(filter).sort("-_id"));

  return mapShops(shops);
};

const findById = async (id) => {
  if (!isValidObjectId(id)) return;

  const shop = await populateAndProject(Shop.findById(id));

  return mapShop(shop);
};

const findByIdAndUpdate = async (id, update, options) => {
  if (!isValidObjectId(id)) return;

  const shop = await populateAndProject(
    Shop.findByIdAndUpdate(id, update, options)
  );

  return mapShop(shop);
};

const findByIdAndDelete = async (id) => {
  if (isValidObjectId(id)) return mapShop(await Shop.findByIdAndDelete(id));
};

module.exports = { findByIdAndDelete, findByIdAndUpdate, getAll, findById };
