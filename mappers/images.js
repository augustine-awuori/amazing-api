const fs = require("fs");
const config = require("config");

const outputFolder = "public/assets/";

const mapImage = (image) => {
  const baseUrl = config.get("assetsBaseUrl");

  return {
    url: `${baseUrl}${image.fileName}_full.jpg`,
    thumbnailUrl: `${baseUrl}${image.fileName}_thumb.jpg`,
  };
};

const imageMapper = (item) => {
  if (item.images) item.images = item.images.map(mapImage);
  if (item.author?.avatar) item.author.avatar = mapImage(item.author.avatar);
  if (item.image) item.image = mapImage(item.image);

  return item;
};

const imageMappers = (items) => items.map(imageMapper);

const imageUnmapper = (item) => {
  item?.images?.forEach(async (image) => {
    fs.unlinkSync(`${outputFolder}${image.fileName}_full.jpg`);
    fs.unlinkSync(`${outputFolder}${image.fileName}_thumb.jpg`);
  });
};

module.exports = { imageMapper, imageMappers, imageUnmapper, mapImage };
