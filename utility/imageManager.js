const AWS = require("aws-sdk");
const config = require("config");
const fs = require("fs");

AWS.config.update({
  credentials: {
    accessKeyId: config.get("awsAccessKey"),
    secretAccessKey: config.get("awsSecretAccessKey"),
  },
  region: "us-east-1",
});

const s3 = new AWS.S3();

const Bucket = config.get("bucket");

async function saveImage(image) {
  return await s3
    .upload({
      Body: fs.readFileSync(image.path),
      Bucket,
      ContentType: "image/jpeg",
      Key: image.filename,
    })
    .promise();
}

function saveImages(images = []) {
  const promises = images.map(async (image) => await saveImage(image));

  return Promise.all(promises);
}

function deleteImage(image) {
  s3.deleteObject({ Bucket, Key: image }, (err) => {
    if (err) throw err;
  });
}

const deleteImages = (images = []) => images.forEach(deleteImage);

const needsMapping = (imageUrl) => imageUrl && !imageUrl.startsWith("https://");

const mapImage = (imageUrl = "") =>
  needsMapping(imageUrl)
    ? `${config.get("assetsBaseUrl")}${imageUrl}`
    : imageUrl;

const mapAuthorImages = (author) => {
  author.avatar = mapImage(author.avatar);
  author.coverPhoto = mapImage(author.coverPhoto);

  return author;
};

const mapImages = (images = []) => images.map(mapImage);

module.exports = {
  deleteImage,
  deleteImages,
  mapAuthorImages,
  mapImage,
  mapImages,
  saveImage,
  saveImages,
};
