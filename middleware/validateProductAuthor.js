module.exports = async (req, res, next) => {
  if (req.product.author._id.toString() !== req.user._id.toString())
    return res.status(401).send({ error: "You're not the shop owner" });

  next();
};
