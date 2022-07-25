const fs = require("fs");

const baseUrl = "http://192.168.43.210:3000/assets/";
const outputFolder = "public/assets/";

const imageMapper = (listing) => {
  const mapImage = (image) => ({
    url: `${baseUrl}${image.fileName}_full.jpg`,
    thumbnailUrl: `${baseUrl}${image.fileName}_thumb.jpg`,
  });

  listing.images = listing.images.map(mapImage);
  if (listing.author.avatar)
    listing.author.avatar = mapImage(listing.author.avatar);

  return listing;
};

const imageUnmapper = (listing) => {
  listing.images.forEach(async (image) => {
    fs.unlinkSync(`${outputFolder}${image.fileName}_full.jpg`);
    fs.unlinkSync(`${outputFolder}${image.fileName}_thumb.jpg`);
  });
};

module.exports = { imageMapper, imageUnmapper };
