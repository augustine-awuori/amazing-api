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

const updateListingExpiry = (listings) =>
  listings.forEach(async (listing) => {
    listing.hasExpired =
      moment().diff(moment(listing.timestamp), "hours") >= 72; // TODO: Get time from a constant
    await listing.save();
  });

const deleteExpiredListings = async (listings) => {
  await updateListingExpiry(listings);
  listings.forEach((listing) => {
    if (listing.hasExpired) imageUnmapper(listing);
  });
  await Listing.deleteMany({ hasExpired: true });
};

function updateCounts(listings) {
  const authorIds = {};

  listings.forEach(async ({ author }) => {
    if (authorIds[author._id]) return;

    const listingsByAuthor = await getAuthorListings(author);
    listingsByAuthor.forEach((listing) => {
      listing.count = listingsByAuthor.length;
    });

    authorIds[author._id] = author._id;
  });
}

const getFreshListings = async (listings) => {
  deleteExpiredListings(listings);
  updateCounts(listings);
  return await Listing.find({}).sort("-_id");
};

const updateAuthorListingsCount = async (author) => {
  const authorListings = await getAuthorListings(author);

  async function updateCount(listing) {
    listing.count = authorListings.length;
    await listing.save();
  }

  authorListings.forEach(updateCount);
};

module.exports = { updateCounts, updateAuthorListingsCount, getFreshListings };
