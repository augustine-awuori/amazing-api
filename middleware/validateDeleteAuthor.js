module.exports = async (req, res, next) => {
  if (req.user._id !== req.body.author.toString())
    return res.status(401).send({
      error: "Permisson denied. You're not the author of this listing.",
    });

  next();
};
