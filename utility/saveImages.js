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
  return await s3
    .upload({
      Body: Buffer.from(fs.readFileSync(image.path)),
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
