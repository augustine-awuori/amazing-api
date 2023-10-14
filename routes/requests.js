const express = require("express");
const router = express.Router();
const { isValidObjectId } = require("mongoose");

const { mapRequest } = require("../mappers/requests");
const { Request, validateRequest } = require("../models/request");
const { User } = require("../models/user");
const auth = require("../middleware/auth");
const service = require("../services/requests");
const validateCategoryId = require("../middleware/validateCategoryId");
const validateRequestAuthor = require("../middleware/validateRequestAuthor");
const validateUser = require("../middleware/validateUser");
const validator = require("../middleware/validate");

router.post(
  "/",
  [auth, validateUser, validateCategoryId, validator(validateRequest)],
  async (req, res) => {
    const author = req.user._id;
    const { category, description, title } = req.body;

    const request = new Request({ author, category, description, title });
    await request.save();

    res.send(await service.findById(request._id));
  }
);

router.get("/", async (_req, res) => {
  const requests = await service.getAll();

  res.send(requests);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  if (!isValidObjectId(id))
    return res.status(400).send({ error: "Invalid ID." });

  const user = await User.findById(id);
  if (!user) {
    const request = await service.findById(id);

    request
      ? res.send(request)
      : res.status(404).send({ error: "Request doesn't exist." });
  }

  const requests = (await service.getAll()).filter(
    ({ author }) => author._id.toString() === id
  );
  res.send(requests);
});

router.delete("/:id", [auth, validateRequestAuthor], async (req, res) => {
  const deletedRequest = await Request.findByIdAndDelete(req.params.id);

  res.send(await mapRequest(deletedRequest));
});

router.put(
  "/:id",
  [
    auth,
    validateUser,
    validateCategoryId,
    validateRequestAuthor,
    validator(validateRequest),
  ],
  async (req, res) => {
    const { category, title, description } = req.body;
    const id = req.params.id;

    if (!isValidObjectId(id))
      return res.status(404).send({ error: "Request doesn't exist" });

    let request = await service.findById(id);
    if (!request)
      return res.status(404).send({ error: "This request doesn't exist" });

    request.category = category;
    request.title = title;
    request.description = description;
    await request.save();

    res.send(request);
  }
);

module.exports = router;
