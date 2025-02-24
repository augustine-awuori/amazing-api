const { isValidObjectId } = require("mongoose");

const { Order } = require("../models/order");

const populateAndProject = (query) =>
  query
    .populate("buyer", "-password")
    .populate("products")
    .populate("shop")
    .populate("status");

const find = async (filter = {}) =>
  await populateAndProject(Order.find(filter).sort('_id'));

const findById = async (id) => {
  if (!isValidObjectId(id)) return;

  return (await find({ _id: id }))[0];
};

const findByIdAndUpdate = async (id, update, options) => {
  if (!isValidObjectId(id)) return;

  const order = await populateAndProject(
    Order.findByIdAndUpdate(id, update, options)
  );

  return order;
};

const findByIdAndDelete = async (id, update, options) => {
  if (!isValidObjectId(id)) return;

  const order = await Order.findByIdAndDelete(id, update, options);

  return order;
};

const findMyOrders = async (myId) => {
  if (!isValidObjectId(myId)) return;

  return await find({ buyer: myId });
};

const findShopOrders = async (shopId) => {
  if (!isValidObjectId(shopId)) return;

  return await find({ shop: shopId });
};

module.exports = {
  find,
  findById,
  findByIdAndDelete,
  findByIdAndUpdate,
  findMyOrders,
  findShopOrders,
};
