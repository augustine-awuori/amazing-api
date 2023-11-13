const { isValidObjectId } = require("mongoose");

const { appBaseURL } = require("../utility/func");
const { deleteImage } = require("../utility/imageManager");
const { mapProduct, mapProducts } = require("../mappers/products");
const { Product } = require("../models/product");
const { sendMessageToAllExcept } = require("../utility/whatsapp");

const populateAndProject = (query) =>
  query.populate("author", "-password").populate("shop");

const findAll = async () => {
  const products = await populateAndProject(Product.find({}).sort("-_id"));

  return mapProducts(products);
};

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

const getNewProductMessage = (shopName, shopId, productId) => `
Subject: 🆕 Discover the Latest Addition on ${shopName} shop!

Hi,

Guess what? A fantastic new product has just landed! 🎉 
Explore it before it's gone!

${appBaseURL}/${shopId.toString()}/${productId.toString()}

Happy shopping!
Campus Mart Team
`;

const informOthers = (product) => {
  const shop = product.shop;
  const message = getNewProductMessage(shop.name, shop._id, product._id);

  sendMessageToAllExcept(shop.author, message);
};

module.exports = {
  findAll,
  findById,
  findByIdAndDelete,
  findByIdAndUpdate,
  findProductsOf,
  findProductsOfShopAndDelete,
  informOthers,
};
