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

async function saveImage(image) {
  const imageStream = fs.createReadStream(image.path);

  return await s3
    .upload({
      Body: image,
      Bucket: config.get("bucket"),
      ContentType: "image/jpeg",
      Key: image.filename,
    })
    .promise();
}

function saveImages(images = []) {
  const promises = images.map(async (image) => {
    const result = await saveImage(image);
    return result;
  });

  return Promise.all(promises);
}

module.exports = { saveImage, saveImages };
