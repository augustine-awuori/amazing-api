module.exports = async (req, res, next) => {
  if (req.post.author.toString() !== req.user._id.toString())
    return res.status(403).send({ error: "You're not the listing author" });

  next();
};
