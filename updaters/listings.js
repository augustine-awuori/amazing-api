const { Listing } = require("../models/listing");

const counter = async (listing) => {
  const authorListings = await Listing.find({ author: listing.author });

  async function updateCount(listing) {
    listing.count = authorListings.length;
    await listing.save();
  }

  authorListings.forEach(updateCount);

  return listing;
};

module.exports = counter;
