const { Listing } = require("../models/listing");

module.exports = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (req.user._id !== listing.authorId.valueOf())
    return res.status(401).send({
      error: "Permisson denied. You're not the author of this listing.",
    });

  req.listing = listing;
  next();
};
