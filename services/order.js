const { isValidObjectId } = require("mongoose");

const { getWhatsAppNumberFromUser } = require("../utility/func");
const { Order } = require("../models/order");
const { sendMessage } = require("../utility/whatsapp");
const shopService = require("./shop");

const populateAndProject = (query) =>
  query.populate("buyer", "-password").populate("products").populate("shop");

const findById = async (id) => {
  if (!isValidObjectId(id)) return;

  const order = await populateAndProject(Order.findById(id));

  return order;
};

const findMyOrders = async (myId) => {
  if (!isValidObjectId(myId)) return;

  const orders = await populateAndProject(Order.find({ buyer: myId }));

  return orders;
};

const findShopOrders = async (shopId) => {
  if (!isValidObjectId(shopId)) return;

  const orders = await populateAndProject(Order.find({ shop: shopId }));

  return orders;
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
  findById,
  findMyOrders,
  findShopOrders,
  getNewOrderMessage,
  informOwner,
};
