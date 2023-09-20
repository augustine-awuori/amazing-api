const service = require("../services/products");

module.exports = async (req, res, next) => {
  const product = await service.findById(req.body._id);

  if (!product)
    return res.status(400).send({ error: "Product is already deleted." });
  req.product = product;

  next();
};
