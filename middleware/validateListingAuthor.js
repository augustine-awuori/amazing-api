module.exports = async (req, res, next) => {
  if (req.listing.author.toString() !== req.body.author.toString())
    return res.status(401).send({ error: "You're not the listing author" });

  next();
};
