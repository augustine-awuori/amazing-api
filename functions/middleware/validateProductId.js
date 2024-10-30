const service = require("../services/products");

module.exports = async (req, res, next) => {
  const product = await service.findById(req.params.id);

  if (!product)
    return res.status(400).send({ error: "Product is not in database." });
  req.product = product;

  next();
};
