const { Listing } = require("../models/listing");

module.exports = (listingId) => Listing.findById(listingId);
