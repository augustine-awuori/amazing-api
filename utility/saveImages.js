const AWS = require("aws-sdk");
const config = require("config");

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
      Body: Buffer.from(image.data),
      Bucket: config.get("bucket"),
      Key: image.filename,
    })
    .promise();
}

function saveImages(images = []) {
  return images.map(async (image) => {
    const result = await saveImage(image);
    return result;
  });
}

module.exports = { saveImage, saveImages };
