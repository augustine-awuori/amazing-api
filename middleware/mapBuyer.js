module.exports = async (req, _res, next) => {
  req.body.buyer = req.user._id;

  next();
};
