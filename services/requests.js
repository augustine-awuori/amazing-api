const { populateAndProject } = require("./main");
const { Request } = require("../models/request");

const getAll = async (filter = {}) => {
  const requests = await populateAndProject(Request.find(filter).sort("-_id"));

  return requests;
};

const findById = async (id) => {
  const request = await populateAndProject(Request.findById(id));

  return request;
};

module.exports = { findById, getAll };
