const path = require("path");
const sharp = require("sharp");
const fs = require("fs");

const outputFolder = "public/assets";

module.exports = async (req, res, next) => {
  if (req.file) {
    await sharp(req.file.path)
      .resize(2000)
      .jpeg({ quality: 50 })
      .toFile(path.resolve(outputFolder, req.file.filename + "_full.jpg"));

    await sharp(req.file.path)
      .resize(200)
      .jpeg({ quality: 30 })
      .toFile(path.resolve(outputFolder, req.file.filename + "_thumb.jpg"));

    fs.unlinkSync(req.file.path);

    req.avatar = { filename: req.file.filename };
  }

  next();
};
