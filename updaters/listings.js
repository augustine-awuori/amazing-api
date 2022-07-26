const { Listing } = require("../models/listing");

const counter = async (author) => {
  const authorListings = await Listing.find({
    author: {
      _id: author._id,
      name: author.name,
      username: author.username,
      avatar: author.avatar,
    },
  });

  async function updateCount(listing) {
    listing.count = authorListings.length;
    await listing.save();
  }

  authorListings.forEach(updateCount);
};

module.exports = counter;
