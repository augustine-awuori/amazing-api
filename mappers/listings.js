const fs = require("fs");
const config = require("config");

const { Category } = require("../models/category");
const { User } = require("../models/user");

const outputFolder = "public/assets/";

const mapImage = (image) =>
  image?.fileName
    ? {
        url: `${config.get("assetsBaseUrl")}${image.fileName}`,
      }
    : null;

const mapAuthorImages = (author) => {
  // if (author.avatar) author.avatar = mapImage(author.avatar);
  // if (author.coverPhoto) author.coverPhoto = mapImage(author.coverPhoto);

  return author;
};

const mapListing = async (listing) => {
  const author = mapAuthorImages(await User.findById(listing.authorId));
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

const mapAvatar = (avatar) => (avatar ? mapImage(avatar) : avatar);

module.exports = {
  imageUnmapper,
  mapAvatar,
  mapListing,
  mapListings,
};
