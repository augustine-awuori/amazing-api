module.exports = (req, res, next) => {
  if (!req.body.message && req.images.length === 0)
    return res.status(400).send({ error: "Failed. Your post is empty." });

  next();
};
