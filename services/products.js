const { isValidObjectId } = require("mongoose");

const { Product } = require("../models/product");
const { User } = require("../models/user");

const populateAndProject = (query) =>
  query
    .populate("author", "-password")
    .populate("shop")
    .populate("type")
    .populate("views");

const createProductFrom = async (listing, shop) => {
  const { author, description, price, title, timestamp, images } = listing;

  let product = new Product({
    name: title,
    price,
    timestamp,
    author,
    description,
    images,
    shop,
  });
  product = await product.save();

  return await findById(product._id);
};

const findBySeller = async (email) => {
  const user = await User.findOne({ email });

  return user
    ? await populateAndProject(Product.find({ author: user._id }))
    : [];
};

const findAll = async () => {
  const products = await populateAndProject(Product.find({}).sort("-_id"));

  return products;
};

const findById = async (id) => {
  if (!isValidObjectId(id)) return;

  return await populateAndProject(Product.findById(id));
};

const findByIdAndUpdate = async (id, update, options) => {
  if (!isValidObjectId(id)) return;

  const product = await populateAndProject(
    Product.findByIdAndUpdate(id, update, options)
  );

  return product;
};

const findByIdAndDelete = async (id) => {
  if (!isValidObjectId(id)) return;

  const product = await Product.findByIdAndDelete(id);

  return product;
};

const findProductsOf = async (shopId) => {
  const products = await populateAndProject(Product.find({ shop: shopId }));

  return products;
};

const findProductsOfShopAndDelete = async (shopId) => {
  const shopProducts = await findProductsOf(shopId);

  shopProducts.forEach(async (p) => await findByIdAndDelete(p._id));

  return shopProducts;
};

module.exports = {
  createProductFrom,
  findAll,
  findById,
  findByIdAndDelete,
  findByIdAndUpdate,
  findProductsOf,
  findProductsOfShopAndDelete,
  findBySeller
};
