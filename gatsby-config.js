/**
 * @type {import('gatsby').GatsbyConfig}
 */

const netlifyAdapter = require("gatsby-adapter-netlify").default;

module.exports = {
  jsxRuntime: "automatic",
  adapter: netlifyAdapter(),

  siteMetadata: {
    title: "Terapia Genesis",
    siteUrl: "https://www.terapiagenesisapp.com",
  },

  plugins: [
    "gatsby-plugin-styled-components",
    "gatsby-plugin-image",
    "gatsby-plugin-sitemap",
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        name: "Terapia Genesis",
        start_url: "/",
        background_color: "#100e17",
        theme_color: "#100e17",
        display: "standalone",
        icon: "src/images/icon.png",
        cache_busting_mode: "none",
      },
    },
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: "./src/images/",
      },
      __key: "images",
    },
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-offline",
  ],
};