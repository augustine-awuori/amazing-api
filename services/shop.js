const { isValidObjectId } = require("mongoose");

const { Shop } = require("../models/shop");
const { mapShop, mapShops } = require("../mappers/shops");
const { deleteImage } = require("../utility/imageManager");
const productService = require("./products");
const userService = require("./users");

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
