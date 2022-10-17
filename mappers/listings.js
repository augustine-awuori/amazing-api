const fs = require("fs");

const baseUrl = "http://192.168.43.210:3000/assets/";
const outputFolder = "public/assets/";

const mapImage = (image) => ({
  url: `${baseUrl}${image.fileName}_full.jpg`,
  thumbnailUrl: `${baseUrl}${image.fileName}_thumb.jpg`,
});

const imageMapper = (listing) => {
  listing.images = listing.images.map(mapImage);
  if (listing.author.avatar)
    listing.author.avatar = mapImage(listing.author.avatar);

  return listing;
};

const mapListings = (listings) => listings.map(imageMapper);

const imageUnmapper = (listing) => {
  listing.images.forEach(async (image) => {
    fs.unlinkSync(`${outputFolder}${image.fileName}_full.jpg`);
    fs.unlinkSync(`${outputFolder}${image.fileName}_thumb.jpg`);
  });
};

const mapAvatar = (avatar) => mapImage(avatar);

module.exports = { imageMapper, imageUnmapper, mapAvatar, mapListings };
