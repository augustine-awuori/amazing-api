module.exports = async (req, res, next) => {
  if (req.item?.author?.toString() !== req.user?.author?.toString())
    return res.status(401).send({ error: "You're not the author" });

  next();
};
