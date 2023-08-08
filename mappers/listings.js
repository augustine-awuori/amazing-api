const { Category } = require("../models/category");
const { mapImage } = require("../utility/imageManager");
const { User } = require("../models/user");

const mapListing = async (listing) => {
  const author = await User.findById(listing.authorId);
  const category = await Category.findById(listing.categoryId);

  author.password = "";
  listing.author = author;
  listing.category = category;
  listing.images = listing.images.map(mapImage);

  return listing;
};

const mapListings = async (listings) =>
  await Promise.all(listings.map(mapListing));

const mapAvatar = (avatarUrl) => (avatarUrl ? mapImage(avatarUrl) : avatarUrl);

module.exports = {
  mapAvatar,
  mapListing,
  mapListings,
};
