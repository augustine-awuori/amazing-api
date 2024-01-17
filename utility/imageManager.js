const winston = require("winston");
const admin = require("firebase-admin");

const serviceAccount = require("../keys/storage-key.json");

const storageBucket = process.env.storageBucket;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket,
});

const bucket = admin.storage().bucket();
const baseURL = process.env.assetsBaseUrl + storageBucket;

async function saveImage(image) {
  try {
    await bucket.upload(image.path, {
      destination: image.filename,
      preconditionOpts: { ifGenerationMatch: 0 },
      gzip: true,
    });
  } catch (error) {
    winston.error(`Error saving an image ${image.filename}:`, error);
  }
}

async function deleteImage(filename) {
  try {
    await bucket.file(filename).delete();
    winston.info(`Image deleted successfully: ${filename}`);
  } catch (error) {
    winston.error(`Error deleting an image ${filename}:`, error);
    throw error;
  }
}

const deleteImages = async (images = []) => {
  try {
    await Promise.all(images.map(deleteImage));
  } catch (error) {
    winston.error("Error deleting images:", error);
    throw error;
  }
};

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
