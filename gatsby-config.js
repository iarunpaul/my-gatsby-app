/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-config/
 */

/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  siteMetadata: {
    title: `I | Arun Paul`,
    description: `Personal website showcasing projects, certifications, and microblogs.`,
    author: `@iarunpaul`,
    siteUrl: `https://web.iarunpaul.com`, // Update with your custom domain
  },
  plugins: [
    `gatsby-plugin-image`,
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-tailwindcss`, // Add Tailwind CSS support
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `microblogs`,
        path: `${__dirname}/src/microblogs`, // Add microblogs folder
      },
    },
    `gatsby-transformer-remark`, // Add Markdown support for microblogs
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `your-name-personal-website`,
        short_name: `yourname`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#3182ce`, // Tailwind blue color
        display: `minimal-ui`,
        icon: `src/images/myimage.png`, // Update with your custom icon
      },
    },
    // Optional: Add Google Analytics
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: `YOUR_GOOGLE_ANALYTICS_TRACKING_ID`,
      },
    },
    // Optional: Add sitemap
    `gatsby-plugin-sitemap`,
    `gatsby-plugin-mdx`,
  ],
};