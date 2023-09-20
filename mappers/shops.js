const { mapAuthorImages, mapImage } = require("../utility/imageManager");

const mapShop = (shop) => {
  if (shop) {
    shop.author = mapAuthorImages(shop.author);
    shop.image = mapImage(shop.image);
  }

  return shop;
};

const mapShops = (shops) => shops.map(mapShop);

module.exports = { mapShop, mapShops };
