const { isValidObjectId } = require("mongoose");

module.exports = (query) => async (req, res, next) => {
  const id = req.body._id || req.params.id;

  if (!isValidObjectId(id))
    return res.status(400).send({ error: "This item's id is invalid" });

  const item = await query(id);
  if (!item) return res.status(404).send({ error: "This item doesn't exist" });

  req.item = item;
  next();
};
