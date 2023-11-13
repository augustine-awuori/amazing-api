const { mapRequests, mapRequest } = require("../mappers/requests");
const { populateAndProject } = require("./main");
const { Request } = require("../models/request");
const { sendMessageToAllExcept } = require("../utility/whatsapp");
const { appBaseURL } = require("../utility/func");

const getAll = async (filter = {}) => {
  const requests = await populateAndProject(Request.find(filter).sort("-_id"));

  return mapRequests(requests);
};

const findById = async (id) => {
  const request = await populateAndProject(Request.findById(id));

  return mapRequest(request);
};

const getNewRequestAlertMessage = (
  request
) => `Subject: 🚀 New Request Alert! Check it Out Now!

Hey,

__${request.title}__
${request.description}

If you have and want to sell this item contact the owner at 
${appBaseURL}/requests/${request._id.toString()}

Happy browsing!
Campus Mart Team`;

const informOthers = (request) => {
  const message = getNewRequestAlertMessage(request);

  sendMessageToAllExcept(request.author, message);
};

module.exports = { findById, informOthers, getAll };
