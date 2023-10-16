const { mapAuthorImages, mapImage } = require("../utility/imageManager");
const shopService = require("../services/shop");

const mapProduct = async (product) => {
  if (product) {
    product.author = mapAuthorImages(product.author);
    product.image = mapImage(product.image);
    p.shop = await shopService.findById(p.shop._id);
  }

  return product;
};

const mapProducts = (products) => products.map(mapProduct);

module.exports = { mapProduct, mapProducts };
