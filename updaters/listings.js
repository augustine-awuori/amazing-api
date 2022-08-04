const { Listing } = require("../models/listing");

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
    // listing.hasExpired = listing.timestamp; // TODO: Extract logic

    await listing.save();
  });

const deleteExpiredListings = async (listings) => {
  await updateListingExpiry(listings);
  await Listing.deleteMany({ hasExpired: true });
};

async function updateCounts(listings) {
  const authorIds = {};

  listings.forEach(({ author }) => {
    if (authorIds[author._id]) return;

    const listingsByAuthor = getAuthorListings(author);
    listingsByAuthor.forEach((listing) => {
      listing.count = listingsByAuthor.length;
    });

    authorIds[author._id] = author._id;
  });
}

const getFreshListings = async (listings) => {
  deleteExpiredListings();
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
