const { isValidObjectId } = require("mongoose");

const getType = require("../utility/getType");

module.exports = async (req, res, next) => {
  const typeId = req.body.type;
  if (!isValidObjectId(typeId))
    return res.status(400).send({ error: "Invalid ID" });

  const type = await getType(typeId);
  if (!type) return res.status(400).send({ error: "Invalid type." });
  req.type = type;

  next();
};
