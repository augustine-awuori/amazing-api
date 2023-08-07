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

function deleteImages(images = []) {
  images.forEach(deleteImage);
}

const mapImage = (imageUrl) => `${config.get("assetsBaseUrl")}${imageUrl}`;

module.exports = { deleteImage, deleteImages, mapImage, saveImage, saveImages };
