module.exports = async (req, res, next) => {
  const seller = req.product.author;

  if (seller._id.toString() !== req.user._id.toString() || !req.user.isAdmin)
    return res.status(403).send({ error: "You're not authorised" });

  next();
};
