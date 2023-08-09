const { mapAuthorImages } = require("../utility/imageManager");

const mapRequest = (request) => {
  if (!request) return request;

  request.author = mapAuthorImages(request.author);

  return request;
};

const mapRequests = (requests) => requests.map(mapRequest);

module.exports = {
  mapRequest,
  mapRequests,
};
