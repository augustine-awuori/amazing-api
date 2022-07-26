const getListing = require("../utility/getListing");

module.exports = async (req, res, next) => {
  const listing = await getListing(req.params.id);

  if (!listing)
    return res
      .status(400)
      .send({ error: "Operation terminated. The listing is already deleted." });
  req.listing = listing;

  next();
};
