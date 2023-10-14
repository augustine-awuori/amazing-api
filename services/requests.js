const { mapRequests, mapRequest } = require("../mappers/requests");
const { populateAndProject } = require("./main");
const { Request } = require("../models/request");

const getAll = async (filter = {}) => {
  const requests = await populateAndProject(Request.find(filter).sort("-_id"));

  return mapRequests(requests);
};

const findById = async (id) => {
  const request = await populateAndProject(Request.findById(id));

  return mapRequest(request);
};

module.exports = { findById, getAll };
