const express = require("express");
const router = express.Router();
const { isValidObjectId } = require("mongoose");

const { mapRequest, mapRequests } = require("../mappers/requests");
const { Request, validateRequest } = require("../models/request");
const { User } = require("../models/user");
const auth = require("../middleware/auth");
const validateCategoryId = require("../middleware/validateCategoryId");
const validateRequestAuthor = require("../middleware/validateRequestAuthor");
const validateUser = require("../middleware/validateUser");
const validator = require("../middleware/validate");

router.post(
  "/",
  [auth, validateUser, validateCategoryId, validator(validateRequest)],
  async (req, res) => {
    const authorId = req.user._id;
    const { categoryId, description, title } = req.body;

    const request = new Request({ authorId, categoryId, description, title });
    await request.save();

    res.send(mapRequest(request));
  }
);

router.get("/", async (req, res) => {
  const requests = await Request.find({}).sort("-_id");

  res.send(await mapRequests(requests));
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  if (!isValidObjectId(id))
    return res.status(400).send({ error: "Invalid ID." });

  const user = await User.findById(id);

  if (!user) {
    let request = await Request.findById(id);

    if (!request)
      return res
        .status(404)
        .send({ error: "Request with the gived ID doesn't exist." });

    return request
      ? res.send(await mapRequest(request))
      : res.status(400).send({ error: "Id provided doesn't exist." });
  }

  const requests = (await Request.find({}).sort("-_id")).filter(
    ({ authorId }) => authorId.toString() === req.params.id
  );

  res.send(await mapRequests(requests));
});

router.delete("/:id", validateRequestAuthor, async (req, res) => {
  const deletedRequest = await Request.findByIdAndDelete(req.params.id);

  res.send(mapRequest(deletedRequest));
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
    const { categoryId, title, description } = req.body;
    let request = await Request.findById(req.params.id);
    if (!request)
      return res
        .status(400)
        .send({ error: "Request intended to be updated doesn't exist" });

    request.categoryId = categoryId;
    request.title = title;
    request.description = description;
    await request.save();

    res.send(mapRequest(request));
  }
);

module.exports = router;
