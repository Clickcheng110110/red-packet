const withImages = require('next-images');
const { i18n } = require('./next-i18next.config');
module.exports = withImages({
  reactStrictMode: true,
  i18n,
  images: {
    disableStaticImages: true,
    // domains: ['https://img.cdn.whoops.world/'],
  },
});
