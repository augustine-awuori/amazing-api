const service = require("../services/users");

module.exports = async (req, res, next) => {
  const { seller } = req.body;

  const sellerInfo = await service.findById(seller);
  if (!sellerInfo?.hasShop)
    return res.status(400).send({ error: "This seller doesn't  have a shop" });

  next();
};
