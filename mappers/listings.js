const mapper = (listing) => {
  const baseUrl = "http://192.168.43.210:3000/assets/";

  const mapImage = (image) => ({
    url: `${baseUrl}${image.fileName}_full.jpg`,
    thumbnailUrl: `${baseUrl}${image.fileName}_thumb.jpg`,
  });

  listing.images = listing.images.map(mapImage);

  return listing;
};

module.exports = mapper;
