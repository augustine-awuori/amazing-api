const { isValidObjectId } = require("mongoose");

const { Order } = require("../models/order");
const { mapOrder, mapOrders } = require("../mappers/orders");

const populateAndProject = (query) =>
  query.populate("buyer", "-password").populate("products");

const findById = async (id) => {
  if (!isValidObjectId(id)) return;

  const order = await populateAndProject(Order.findById(id));

  return mapOrder(order);
};

const findMyOrders = async (myId) => {
  if (!isValidObjectId(myId)) return;

  const orders = await Order.find({ buyer: myId });

  return mapOrders(orders);
};

const findShopOrders = async (shopId) => {
  if (!isValidObjectId(shopId)) return;

  const orders = await Order.find({ shop: shopId });

  return mapOrders(orders);
};

module.exports = { findById, findMyOrders, findShopOrders };
