const { isValidObjectId } = require("mongoose");

const { Shop } = require("../models/shop");
const productService = require("./products");
const userService = require("./users");

const populateAndProject = (query) => query.populate("author", "-password");

const getAll = async (filter = {}) => {
  const shops = await populateAndProject(Shop.find(filter).sort("-_id"));

  return shops;
};

const findById = async (id) => {
  if (!isValidObjectId(id)) return;

  const shop = await populateAndProject(Shop.findById(id));

  return shop;
};

const findByIdAndUpdate = async (id, update, options) => {
  if (!isValidObjectId(id)) return;

  const shop = await populateAndProject(
    Shop.findByIdAndUpdate(id, update, options)
  );

  return shop;
};

const findByIdAndDelete = async (id) => {
  if (!isValidObjectId(id)) return;

  const shop = await Shop.findByIdAndDelete(id);
  productService.findProductsOfShopAndDelete(id);

  return shop;
};

const find = async (query = {}) => await Shop.findOne(query);

const getShopOwner = async (shopId) => {
  const shop = await findById(shopId);

  return await userService.findById(shop.author._id);
};

const findByAuthorId = async (authorId) =>
  isValidObjectId(authorId)
    ? (await getAll()).filter(
        ({ author }) => author._id.toString() === authorId
      )
    : [];

module.exports = {
  find,
  findByAuthorId,
  findById,
  findByIdAndDelete,
  findByIdAndUpdate,
  getAll,
  getShopOwner,
};
