const { Category } = require("../models/category");
const { mapImage } = require("./images");
const { User } = require("../models/user");

const mapAuthorImages = (author) => {
  if (author.avatar) author.avatar = mapImage(author.avatar);
  if (author.coverPhoto) author.coverPhoto = mapImage(author.coverPhoto);

  return author;
};

const mapRequest = async (request) => {
  const author = mapAuthorImages(await User.findById(request.authorId));
  const category = await Category.findById(request.categoryId);

  author.password = "";
  request.author = author;
  request.category = category;

  return request;
};

const mapRequests = async (requests) =>
  await Promise.all(requests.map(mapRequest));

module.exports = {
  mapRequest,
  mapRequests,
};
