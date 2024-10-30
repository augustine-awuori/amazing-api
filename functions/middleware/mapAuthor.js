module.exports = async (req, _res, next) => {
  req.body.author = req.user._id.toString();

  next();
};
