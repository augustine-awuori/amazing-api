const express = require("express");
const router = express.Router();

const { Job } = require("../models/job");
const { User } = require("../models/user");
const { mapJobs, mapJob } = require("../mappers/jobs");
const auth = require("../middleware/auth");

router.post("/", auth, async (req, res) => {
  const { authorId, description, salary, title } = req.body;
  const author = await User.findById(authorId);
  if (!author) return res.status(400).send("Job creator doesn't exist.");

  const job = new Job({ author, description, salary, title });
  await job.save();

  res.send(job);
});

router.get("/", async (req, res) => {
  const jobs = await Job.find({}).sort("-_id");

  res.send(mapJobs(jobs));
});

router.delete("/:id", auth, async (req, res) => {
  const job = await Job.findByIdAndDelete(req.params.id);

  res.send(mapJob(job));
});

router.put("/:id", auth, async (req, res) => {
  const { description, salary, title } = req.body;
  const job = await Job.findById(req.params.id);
  if (!job)
    return res.status(400).send("The job with the given ID was not found");
  console.log({ description, salary, title });
  job.title = title;
  job.salary = salary;
  job.description = description;
  await job.save();

  res.send(mapJob(job));
});

module.exports = router;
