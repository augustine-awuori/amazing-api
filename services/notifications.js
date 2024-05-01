const { isValidObjectId } = require("mongoose");

const { Notification } = require("../models/notification");
const { populateAndProject } = require("./main");

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

const findByUserId = async (userId) => {
  if (isValidObjectId(userId))
    return await populateAndProject(Notification.find({ to: userId }));
};

module.exports = {
  findById,
  findByIdAndUpdate,
  findByUserId,
};
