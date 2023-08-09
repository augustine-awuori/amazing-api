const populateAndProject = (query) =>
  query.populate("author", "-password").populate("category");

module.exports = { populateAndProject };
