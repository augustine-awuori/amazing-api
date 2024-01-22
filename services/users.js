const { User } = require("../models/user");
const { isValidObjectId } = require("mongoose");

const exists = async (userId) => {
  if (isValidObjectId(userId)) return await User.findById(userId);
};

const findOne = async (filter = {}) => await User.findOne(filter);

const findById = async (id) => {
  const user = await exists(id);

  return user;
};

const getAll = async (filter = {}) => {
  const users = await User.find(filter);

  return users;
};

module.exports = { exists, findById, findOne, getAll };
