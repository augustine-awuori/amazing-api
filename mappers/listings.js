const fs = require("fs");

const { Category } = require("../models/category");
const { mapImage } = require("../mappers/images");
const { User } = require("../models/user");

const outputFolder = "public/assets/";

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

const imageUnmapper = (listing) =>
  listing.images.forEach(async (image) => {
    if (image?.fileName) {
      fs.unlinkSync(`${outputFolder}${image.fileName}_full.jpg`);
      fs.unlinkSync(`${outputFolder}${image.fileName}_thumb.jpg`);
    }
  });

const mapAvatar = (avatarUrl) => (avatarUrl ? mapImage(avatarUrl) : avatarUrl);

module.exports = {
  imageUnmapper,
  mapAvatar,
  mapListing,
  mapListings,
};
