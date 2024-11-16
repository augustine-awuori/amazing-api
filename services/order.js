const { isValidObjectId } = require("mongoose");

const { getWhatsAppNumberFromUser } = require("../utility/func");
const { Order } = require("../models/order");
const { sendMessage } = require("../utility/whatsapp");
const shopService = require("./shop");

const populateAndProject = (query) =>
  query
    .populate("buyer", "-password")
    .populate("products")
    .populate("shop")
    .populate("status");

const find = async (filter = {}) =>
  await populateAndProject(Order.find(filter));

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

const getNewOrderMessage = (shopId, orderId) => `
You've a new order. 

Check it out at https://kisiiuniversemart.digital/orders/my-shops/${shopId}/${orderId}
`;

const informOwner = async (shopId, orderId) => {
  const phone = getWhatsAppNumberFromUser(
    await shopService.getShopOwner(shopId)
  );
  const message = getNewOrderMessage(shopId, orderId);

  sendMessage(phone, message);
};

module.exports = {
  find,
  findById,
  findByIdAndDelete,
  findByIdAndUpdate,
  findMyOrders,
  findShopOrders,
  getNewOrderMessage,
  informOwner,
};
