const winston = require("winston");
const { initializeApp } = require("firebase/app");
const {
  getStorage,
  getDownloadURL,
  ref,
  uploadBytes,
  deleteObject,
} = require("firebase/storage");

const firebaseConfig = {
  apiKey: "AIzaSyCAtitgurCoK8LIYRWfo2i95Q6otoTmXSA",
  authDomain: "kisii-campus-mart-site.firebaseapp.com",
  projectId: "kisii-campus-mart-site",
  storageBucket: "kisii-campus-mart-site.appspot.com",
  messagingSenderId: "66759292374",
  appId: "1:66759292374:web:2a09e7ad0919c6a056e077",
  measurementId: "G-C2MJ2XQDCQ",
};

const storage = getStorage(initializeApp(firebaseConfig));

const saveImage = async (image) => {
  try {
    const result = await uploadBytes(ref(storage), image);
    return await getDownloadURL(result.ref);
  } catch (error) {
    winston.error(`Image upload or download URL retrieval failed! ${error}`);
  }
};

const saveImages = async (images = []) => {
  const uploadPromises = images.map(async (image) => {
    return saveImage(image);
  });

  try {
    const downloadURLs = await Promise.all(uploadPromises);
    return downloadURLs;
  } catch (error) {
    winston.error(`Images upload failed! ${error}`);
    return [];
  }
};

const deleteImage = async (imageUrl) => {
  try {
    await deleteObject(ref(storage, imageUrl));
  } catch (error) {
    winston.error(`Image deletion failed! ${error}`);
  }
};

const deleteImages = async (imagesUrl = []) => {
  try {
    imagesUrl.forEach(deleteImage);
  } catch (error) {
    winston.error(`Images deletion failed! ${error}`);
  }
};

module.exports = { deleteImage, deleteImages, saveImage, saveImages };
