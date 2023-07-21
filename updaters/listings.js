const { Listing } = require("../models/listing");
const moment = require("moment");
const { imageUnmapper } = require("../mappers/listings");

const getAuthorProperties = (author) => ({
  _id: author._id,
  name: author.name,
  username: author.username,
  avatar: author.avatar,
});

const getAuthorListings = async (author) =>
  await Listing.find({
    author: getAuthorProperties(author),
  });

const updateExpiry = (listings) =>
  listings.map((listing) => {
    listing.hasExpired =
      moment().diff(moment(listing.timestamp), "hours") >= 72; // TODO: Get time from a constant

    return listing;
  });

const deleteExpired = (listings) => {
  const updated = updateExpiry(listings);
  const valid = [];

  updated.forEach(async (item) => {
    if (item.hasExpired) {
      imageUnmapper(item);
      await Listing.findByIdAndDelete(item._id);
    } else valid.push(item);
  });

  return valid;
};

function updateCounts(listings) {
  const authorIds = {};

  listings.forEach(async ({ author }) => {
    if (authorIds[author._id.toString()]) return;

    const listings = await getAuthorListings(author);
    listings.forEach((listing) => {
      listing.count = listings.length;
    });

    authorIds[author._id.toString()] = author._id.toString();
  });

  return listings;
}

const getValid = (listings) => updateCounts(deleteExpired(listings));

const updateAuthorListingsCount = async (author) => {
  const authorListings = await getAuthorListings(author);

  authorListings.forEach(async (listing) => {
    listing.count = authorListings.length;
    await listing.save();
  });
};

module.exports = { updateCounts, updateAuthorListingsCount };
