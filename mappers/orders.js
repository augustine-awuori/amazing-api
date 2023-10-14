const { mapAuthorImages } = require("../utility/imageManager");
const { mapProducts } = require("./products");
const { mapShop } = require("./shops");

const mapOrder = (order) => {
  if (order) {
    order.buyer = mapAuthorImages(order.buyer);
    order.products = mapProducts(order.products);
    order.shop = mapShop(order.shop);
  }

  return order;
};

const mapOrders = (orders) => orders.map(mapOrder);

module.exports = { mapOrder, mapOrders };
