const { mapImage } = require("../mappers/images");

const mapAvatar = (avatar) => (avatar ? mapImage(avatar) : undefined);

const mapJob = (job) => {
  job.author.avatar = mapAvatar(job.author?.avatar);

  return job;
};

const mapJobs = (jobs) => jobs.map(mapJob);

module.exports = { mapJobs, mapJob };
