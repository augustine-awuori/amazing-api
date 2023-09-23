const { mapAuthorImages } = require("../utility/imageManager");
const { mapProducts } = require("./products");

const mapOrder = (order) => {
  if (order) {
    order.buyer = mapAuthorImages(order.buyer);
    order.seller = mapAuthorImages(order.seller);
    order.products = mapProducts(order.products);
  }

  return order;
};

const mapOrders = (orders) => orders.map(mapOrder);

module.exports = { mapOrder, mapOrders };
