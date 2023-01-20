const fs = require("fs");

const baseUrl = "http://192.168.43.210:3000/assets/";
const outputFolder = "public/assets/";

const mapImage = (image) => ({
  url: `${baseUrl}${image.fileName}_full.jpg`,
  thumbnailUrl: `${baseUrl}${image.fileName}_thumb.jpg`,
});

const imageMapper = (item) => {
  let likesAuthorsId = {};
  let dislikesAuthorsId = {};

  if (item.images) item.images = item.images.map(mapImage);
  if (item.author?.avatar) item.author.avatar = mapImage(item.author.avatar);
  if (item.image) item.image = mapImage(item.image);
  if (item.likes) {
    item.likes = item.likes.map((author) => {
      if (author?.avatar) author.avatar = mapImage(author.avatar);
      const authorId = author._id.toString();
      likesAuthorsId[authorId] = authorId;

      return author;
    });
    item.likesAuthorsId = likesAuthorsId;
  }
  if (item.dislikes) {
    item.dislikes = item.dislikes.map((author) => {
      if (author?.avatar) author.avatar = mapImage(author.avatar);
      const authorId = author._id.toString();
      dislikesAuthorsId[authorId] = authorId;

      return author;
    });
    item.dislikesAuthorsId = dislikesAuthorsId;
  }

  return item;
};

const imageMappers = (items) => items.map(imageMapper);

const imageUnmapper = (item) => {
  item.images.forEach(async (image) => {
    fs.unlinkSync(`${outputFolder}${image.fileName}_full.jpg`);
    fs.unlinkSync(`${outputFolder}${image.fileName}_thumb.jpg`);
  });
};

module.exports = { imageMapper, imageMappers, imageUnmapper, mapImage };
