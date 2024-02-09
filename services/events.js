const { isValidObjectId } = require("mongoose");

const { Event } = require("../models/event");
const { populateAndProject } = require("./main");

const findById = async (id) => {
  if (isValidObjectId(id)) return await populateAndProject(Event.findById(id));
};

const create = async (user, event) => {
  const { image, description, title, fee, location, startsAt, endsAt } = event;
  const initialized = new Event({
    author: user,
    image,
    description,
    title,
    fee,
    startsAt,
    endsAt,
    location,
  });

  await initialized.save();

  return initialized;
};

const findByIdAndDelete = async (id) => {
  if (isValidObjectId(id)) return await Event.findByIdAndDelete(id);
};

const getAll = async (filter = {}) => {
  const events = await populateAndProject(Event.find(filter).sort("-_id"));

  return events;
};

const findByIdAndUpdate = async (id, update, options) => {
  if (isValidObjectId(id))
    return await populateAndProject(
      Event.findByIdAndUpdate(id, update, options)
    );
};

module.exports = {
  create,
  findById,
  findByIdAndDelete,
  findByIdAndUpdate,
  getAll,
};
