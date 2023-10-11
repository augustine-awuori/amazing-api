const { isValidObjectId } = require("mongoose");

const { Shop } = require("../models/shop");
const { mapShop, mapShops } = require("../mappers/shops");
const { deleteImage } = require("../utility/imageManager");
const productService = require("./products");

const populateAndProject = (query) =>
  query.populate("author", "-password").populate("type");

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
  if (!isValidObjectId(id)) return;

  const shop = await Shop.findByIdAndDelete(id);
  deleteImage(shop.image);
  productService.findProductsOfShopAndDelete(id);

  return shop;
};

const find = async (query = {}) => await Shop.findOne(query);

module.exports = {
  find,
  findByIdAndDelete,
  findByIdAndUpdate,
  getAll,
  findById,
};
