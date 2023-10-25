const { isValidObjectId } = require("mongoose");
const winston = require("winston");

const { Order } = require("../models/order");
const { mapOrder, mapOrders } = require("../mappers/orders");
const shopService = require("./shop");
const whatsapp = require("../utility/whatsapp");

const getShopId = (order) => {
  if (typeof order.shop === "string") return order.shop;
  return order.shop?._id;
};

const sendMessageToShopOwner = async (order) => {
  const shopOwner = await shopService.getShopOwner(getShopId(order));

  const phone = shopOwner?.otherAccounts.whatsapp;
  if (!phone) return winston.error("Can't send whatsapp msg to an empty phone");

  whatsapp.sendTo(phone, order.message);
};

const populateAndProject = (query) =>
  query.populate("buyer", "-password").populate("products").populate("shop");

const findById = async (id) => {
  if (!isValidObjectId(id)) return;

  const order = await populateAndProject(Order.findById(id));

  return mapOrder(order);
};

const findMyOrders = async (myId) => {
  if (!isValidObjectId(myId)) return;

  const orders = await populateAndProject(Order.find({ buyer: myId }));

  return mapOrders(orders);
};

const findShopOrders = async (shopId) => {
  if (!isValidObjectId(shopId)) return;

  const orders = await populateAndProject(Order.find({ shop: shopId }));

  return mapOrders(orders);
};

module.exports = {
  findById,
  findMyOrders,
  findShopOrders,
  sendMessageToShopOwner,
};
