const { Listing } = require("../models/listing");

module.exports = async (req, res, next) => {
  const listing = await Listing.findById(req.body._id);

  if (!listing)
    return res.status(400).send({ error: "Listing is already deleted." });
  req.listing = listing;

  next();
};
