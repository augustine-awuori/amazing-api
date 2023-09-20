const { mapAuthorImages, mapImage } = require("../utility/imageManager");

const mapProduct = (product) => {
  if (product) {
    product.author = mapAuthorImages(product.author);
    product.image = mapImage(product.image);
  }

  return product;
};

const mapProducts = (products) => products.map(mapProduct);

module.exports = { mapProduct, mapProducts };
