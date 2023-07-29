module.exports = async (req, res, next) => {
  if (req.listing.authorId.valueOf() !== req.body.authorId)
    return res.status(401).send({ error: "You're not the listing author" });

  next();
};
