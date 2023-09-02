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

function updateImages(files = [], user) {
  const avatar = files.find(({ fieldname }) => fieldname === "avatar");
  const coverPhoto = files.find(({ fieldname }) => fieldname === "coverPhoto");

  if (thereAreNoImages(files, user, avatar)) return user;
  if (isDeletingAvatar(avatar, user)) {
    user.avatar = "";
    deleteImage(user.avatar);
  }
  if (isDeletingCoverPhoto(coverPhoto, user)) {
    user.coverPhoto = "";
    deleteImage(user.coverPhoto);
  }
  if (isUpdatingAvatar(avatar, user)) {
    deleteImage(user.avatar);
    user.avatar = avatar.filename;
    saveImage(avatar);
  }
  if (isUpdatingCoverPhoto(coverPhoto, user)) {
    deleteImage(user.coverPhoto);
    user.coverPhoto = coverPhoto.filename;
    saveImage(coverPhoto);
  }
  if (isAddingAvatar(avatar, user)) {
    user.avatar = avatar.filename;
    saveImage(avatar);
  }
  if (isAddingCoverPhoto(coverPhoto, user)) {
    user.coverPhoto = coverPhoto.fieldname;
    saveImage(coverPhoto);
  }

  return user;
}

function isAddingAvatar(avatar, user) {
  return avatar && !user?.avatar;
}

function isAddingCoverPhoto(coverPhoto, user) {
  return coverPhoto && !user?.coverPhoto;
}

function isUpdatingCoverPhoto(coverPhoto, user) {
  return coverPhoto && user?.coverPhoto;
}

function isUpdatingAvatar(avatar, user) {
  return avatar && user?.avatar;
}

function isDeletingCoverPhoto(coverPhoto, user) {
  return !coverPhoto && user?.coverPhoto;
}

function isDeletingAvatar(avatar, user) {
  return !avatar && user?.avatar;
}

function thereAreNoImages(files, user, avatar) {
  return (
    !files.length &&
    !avatar &&
    !coverPhoto &&
    !user?.avatar &&
    !user?.coverPhoto
  );
}

module.exports = {
  deleteImage,
  deleteImages,
  mapAuthorImages,
  mapImage,
  mapImages,
  updateImages,
  saveImage,
  saveImages,
};
