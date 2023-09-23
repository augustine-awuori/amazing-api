const { isValidObjectId } = require("mongoose");

const { Order } = require("../models/order");
const { mapOrder } = require("../mappers/orders");

const populateAndProject = (query) =>
  query
    .populate("seller", "-password")
    .populate("buyer", "-password")
    .populate("products");

const findById = async (id) => {
  if (!isValidObjectId(id)) return;

  const order = await populateAndProject(Order.findById(id));

  return mapOrder(order);
};

module.exports = { findById };
