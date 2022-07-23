const { Listing } = require("../models/listing");

module.exports = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (req.user._id !== listing.author._id.valueOf())
    return res.status(401).send({
      error: "Permisson denied. You're not the author of this listing.",
    });

  next();
};
