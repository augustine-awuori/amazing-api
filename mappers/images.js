const fs = require("fs");

const baseUrl = "https://0163-41-80-96-223.in.ngrok.io/assets/";
const outputFolder = "public/assets/";

const mapImage = (image) => ({
  url: `${baseUrl}${image.fileName}_full.jpg`,
  thumbnailUrl: `${baseUrl}${image.fileName}_thumb.jpg`,
});

const imageMapper = (item) => {
  if (item.images) item.images = item.images.map(mapImage);
  if (item.author?.avatar) item.author.avatar = mapImage(item.author.avatar);
  if (item.image) item.image = mapImage(item.image);

  return item;
};

const imageUnmapper = (item) => {
  item.images.forEach(async (image) => {
    fs.unlinkSync(`${outputFolder}${image.fileName}_full.jpg`);
    fs.unlinkSync(`${outputFolder}${image.fileName}_thumb.jpg`);
  });
};

module.exports = { imageMapper, imageUnmapper, mapImage };
