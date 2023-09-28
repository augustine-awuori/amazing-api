const { format } = require("util");
const { Storage } = require("@google-cloud/storage");
const config = require("config");
const path = require("path");
const winston = require("winston");

const storage = new Storage({
  keyFilename: path.join(__dirname, "../config/keys.json"),
  projectId: config.get("googleProjectId"),
});

const bucket = storage.bucket(config.get("bucket"));

const baseURL = config.get("assetsBaseUrl") + config.get("bucket");

async function saveImage(image) {
  return new Promise((resolve, reject) => {
    const { originalname, buffer } = image;

    const blob = bucket.file(originalname.replace(/  /g, "_"));
    const blobStream = blob.createWriteStream({ resumable: false });

    blobStream
      .on("finish", () => {
        const publicUrl = format(
          `https://storage.googleapis.com/${bucket.name}/${blob.name}`
        );
        resolve(publicUrl);
      })
      .on("error", (error) => {
        console.error("Error uploading image:", error);
        reject(`Unable to upload image, something went wrong`);
      })
      .end(buffer);
  });
}

function saveImages(images = []) {
  const promises = images.map(async (image) => await saveImage(image));

  return Promise.all(promises);
}

async function deleteImage(filename) {
  try {
    await bucket(bucket).file(filename).delete();
  } catch (error) {
    winston.error(`Error deleting an image ${filename}:`, error);
  }
}

const deleteImages = (images = []) => images.forEach(deleteImage);

const isMapped = (imageUrl) => imageUrl && imageUrl.startsWith("https://");

const mapImage = (imageUrl = "") =>
  isMapped(imageUrl) ? imageUrl : baseURL + "/" + imageUrl;

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
