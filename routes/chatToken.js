const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const userService = require("../services/users");

router.post("/", auth, async (req, res) => {
  const userId = req.user._id;

  const user = await userService.findById(userId);
  if (!user)
    return res
      .status(404)
      .send({ error: "You don't exist in the database. Sign Up" });

  let token = "";
  if (user.chatToken) {
    token = user.chatToken;
  } else {
    token = userService.getUserChatToken(userId);

    await userService.findByIdAndUpdate(userId, { chatToken: token });
  }

  res.send(token);
});

module.exports = router;
