const { Reply } = require("../models/reply");

module.exports = async (req, res, next) => {
  const reply = await Reply.findById(req.params.id);

  if (!reply)
    return res.status(404).send("The reply doesn't exist in the database.");
  req.reply = reply;

  next();
};
