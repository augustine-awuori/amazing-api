const { mapAuthorImages, mapImages } = require("../utility/imageManager");

const mapListing = (listing) => {
  if (listing) {
    listing.author = mapAuthorImages(listing.author);
    listing.images = mapImages(listing.images);
  }

  return listing;
};

const mapListings = (listings) => listings.map(mapListing);

module.exports = {
  mapListing,
  mapListings,
};
