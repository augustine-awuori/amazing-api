const { Storage } = require("@google-cloud/storage");
const config = require("config");
const winston = require("winston");

const projectId = "kisii-universe-mart-bucket";
const storage = new Storage({ keyFilename: config.get("keys_url"), projectId });
const bucket = storage.bucket(projectId);
const baseURL = config.get("assetsBaseUrl") + projectId;

async function saveImage(image) {
  await bucket.upload(image.path, {
    destination: image.filename,
    preconditionOpts: { ifGenerationMatch: 0 },
  });
}

function saveImages(images = []) {
  const promises = images.map(async (image) => await saveImage(image));

  return Promise.all(promises);
}

async function deleteImage(filename) {
  try {
    await bucket.file(filename).delete();
  } catch (error) {
    winston.error(`Error deleting an image ${filename}:`, error);
  }
}

const deleteImages = (images = []) => images.forEach(deleteImage);

const isMapped = (imageUrl) => imageUrl?.startsWith("https://");

const mapImage = (imageUrl = "") =>
  isMapped(imageUrl) ? imageUrl : `${baseURL}/${imageUrl}`;

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
