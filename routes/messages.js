const express = require("express");
const router = express.Router();

const { sendMessageToAllExcept } = require("../utility/whatsapp");
const auth = require("../middleware/auth");

router.post("/", auth, (req, res) => {
  if (!req.user.isAdmin)
    return res.status(403).send({ error: "You're not an admin" });

  const message = req.body.message;
  sendMessageToAllExcept("", message);

  res.send({ message });
});

module.exports = router;
