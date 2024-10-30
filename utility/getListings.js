const { Listing } = require("../models/listing");

module.exports = () => Listing.find({});
