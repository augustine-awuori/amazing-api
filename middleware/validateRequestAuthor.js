const { Request } = require("../models/request");

module.exports = async (req, res, next) => {
  const request = await Request.findById(req.params.id);
  if (!request) return res.status(404).send({ error: "Request not found!" });

  if (request.author.toString() !== req.user._id.toString())
    return res.status(403).send({ error: "Forbidden! You're not the author!" });

  req.request = request;
  next();
};
