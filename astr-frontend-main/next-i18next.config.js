/** @type {import('next-i18next').UserConfig} */
module.exports = {
  i18n: {
    defaultLocale: "cn",
    locales: ["cn", "en"],
    localePath:
      typeof window === "undefined"
        ? require("path").resolve("./public/locales")
        : "/locales",

    reloadOnPrerender: process.env.NODE_ENV === "development",
  },
};
