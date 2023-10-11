const { isValidObjectId } = require("mongoose");

const { deleteImage } = require("../utility/imageManager");
const { mapProduct, mapProducts } = require("../mappers/products");
const { Product } = require("../models/product");

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
  if (!isValidObjectId(id)) return;

  const product = await Product.findByIdAndDelete(id);
  deleteImage(product.image);

  return product;
};

const findProductsOf = async (shopId) => {
  const products = await populateAndProject(Product.find({ shop: shopId }));

  return mapProducts(products);
};

const findProductsOfShopAndDelete = async (shopId) => {
  const shopProducts = await findProductsOf(shopId);

  shopProducts.forEach(async (p) => await findByIdAndDelete(p._id));

  return shopProducts;
};

module.exports = {
  findById,
  findByIdAndDelete,
  findByIdAndUpdate,
  findProductsOf,
  findProductsOfShopAndDelete,
};
