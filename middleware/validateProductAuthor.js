module.exports = async (req, res, next) => {
  const author = req.product.author;

  if (author._id.toString() !== req.user._id.toString() || !author.isAdmin)
    return res.status(403).send({ error: "You're not the shop owner" });

  next();
};
