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
    return mapListing(await Product.findByIdAndDelete(id));
};

const findProductsOf = async (shopId) => {
  const products = await Product.find({ shop: shopId });

  return mapProducts(products);
};

module.exports = {
  findById,
  findByIdAndDelete,
  findByIdAndUpdate,
  findProductsOf,
};
