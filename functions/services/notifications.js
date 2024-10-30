const { isValidObjectId } = require("mongoose");

const { Notification } = require("../models/notification");

const populateAndProject = (query) =>
  query.populate("buyer", "-password").populate("seller", '-password');

const findById = async (id) => {
  if (isValidObjectId(id))
    return await populateAndProject(Notification.findById(id));
};

const findByIdAndUpdate = async (id, update, options) => {
  if (isValidObjectId(id))
    return await populateAndProject(
      Notification.findByIdAndUpdate(id, update, options)
    );
};

const findByBuyerId = async (buyerId) => {
  if (isValidObjectId(buyerId))
    return await populateAndProject(Notification.find({ buyer: buyerId }));
};

const findBySellerId = async (sellerId) => {
  if (isValidObjectId(sellerId))
    return await populateAndProject(Notification.find({ seller: sellerId }));
};

module.exports = {
  findById,
  findByIdAndUpdate,
  findByBuyerId,
  findBySellerId
};
