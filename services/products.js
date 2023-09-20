const { isValidObjectId } = require("mongoose");

const { Product } = require("../models/product");
const { mapProduct, mapProducts } = require("../mappers/products");

const populateAndProject = (query) => query.populate("author", "-password");

const findById = async (id) => {
  if (!isValidObjectId(id)) return;

  const product = await populateAndProject(Product.findById(id));

  return mapProduct(product);
};

const findByIdAndUpdate = async (id, update, options) => {
  if (!isValidObjectId(id)) return;

  const product = await populateAndProject(
    Product.findByIdAndUpdate(id, update, options)
  );

  return mapProduct(product);
};

const findByIdAndDelete = async (id) => {
  if (isValidObjectId(id))
    return mapListing(await Listing.findByIdAndDelete(id));
};

module.exports = { findById, findByIdAndDelete, findByIdAndUpdate };
