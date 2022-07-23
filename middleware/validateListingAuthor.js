module.exports = async (req, res, next) => {
  if (req.listing.author._id.valueOf() !== req.body.authorId)
    return res.status(401).send({ error: "You're not the listing author" });

  next();
};
