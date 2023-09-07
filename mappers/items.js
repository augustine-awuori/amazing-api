const { mapAuthorImages } = require("../utility/imageManager");

const mapItem = (item) => {
  if (!item) return item;

  item.author = mapAuthorImages(item.author);

  return item;
};

const mapItems = (items = []) => items.map(mapItem);

module.exports = { mapItem, mapItems };
