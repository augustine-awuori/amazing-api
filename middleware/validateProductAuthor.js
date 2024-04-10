module.exports = async (req, res, next) => {
  const seller = req.product.author;

  if (!seller?._id?.toString())
    return res.status(500).send({ error: "App error!" });

  // if (seller._id.toString() !== req.user._id.toString() || !req.user.isAdmin)
  //   return res.status(403).send({ error: "You're not authorised" });

  next();
};
