/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-config/
 */
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})
/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  siteMetadata: {
     title: "Tech Innovation Hub",
    description: "AI-powered professional insights and technical content",
    author: `@iarunpaul`,
    siteUrl: `https://web.iarunpaul.com`, // Update with your custom domain
  },
  developMiddleware: app => {
    app.use(
      '/___graphql',
      (req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*')
        next()
      }
    )
  },
  plugins: [
    `gatsby-plugin-image`,
    `gatsby-plugin-tailwindcss`, // Add Tailwind CSS support
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-postcss`, // Add PostCSS support
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
        name: `blogs`,
        path: `${__dirname}/src/blogs`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `microblogs`,
        path: `${__dirname}/src/microblogs`,
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
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 800,
              quality: 75,
              withWebp: true,
              loading: "lazy",
            },
          },
          {
            resolve: "gatsby-remark-copy-linked-files",
            options: {
              // `ignoreFileExtensions` defaults to [`png`, `jpg`, `jpeg`, `bmp`, `tiff`]
              // as we assume you'll use gatsby-remark-images to handle
              // images in markdown as it automatically creates responsive
              // versions of images.
              //
              // If you'd like to not use gatsby-remark-images and just copy your
              // original images to the public directory, set
              // `ignoreFileExtensions` to an empty array.
              // ignoreFileExtensions: [],
            },
          },
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              classPrefix: "language-",
              inlineCodeMarker: null,
              aliases: {
                ts: "typescript",
                js: "javascript",
                py: "python",
                rb: "ruby",
                go: "golang",
                rs: "rust",
                kt: "kotlin",
                swift: "swift",
                java: "java",
                php: "php",
                c: "c",
                cpp: "cpp",
                cs: "csharp",
                sh: "bash",
                yml: "yaml",
                json: "json",
              },
              showLineNumbers: false,
              noInlineHighlight: false,
              languageExtensions: [
                {
                  language: "superscript",
                  extend: "javascript",
                  definition: {
                    superscript_types: /(SuperType)/,
                  },
                  insertBefore: {
                    function: {
                      superscript_keywords: /(superif|superelse)/,
                    },
                  },
                },
              ],
              prompt: {
                user: "root",
                host: "localhost",
                global: false,
              },
              escapeEntities: {},
            },
          },
        ],
      },
    },// API routes support
    {
      resolve: `gatsby-plugin-page-creator`,
      options: {
        path: `${__dirname}/src/api`,
      },
    },
    // // Enable Gatsby Functions for API routes
    // {
    //   resolve: `gatsby-plugin-gatsby-cloud`,
    //   options: {
    //     // This enables Gatsby Functions
    //   },
    // },

    // Optional: Add sitemap
    `gatsby-plugin-sitemap`,
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [`.mdx`, `.md`],
        mdxOptions: {
          remarkPlugins: [require(`remark-gfm`)],
        },
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 800,
              quality: 75,
              withWebp: true,
              loading: "lazy",
              linkImagesToOriginal: false,
              backgroundColor: "transparent",
              showCaptions: true,
              markdownCaptions: true,
            },
          },
          {
            resolve: "gatsby-remark-copy-linked-files",
            options: {
              // `ignoreFileExtensions` defaults to [`png`, `jpg`, `jpeg`, `bmp`, `tiff`]
              // as we assume you'll use gatsby-remark-images to handle
              // images in markdown as it automatically creates responsive
              // versions of images.
              //
              // If you'd like to not use gatsby-remark-images and just copy your
              // original images to the public directory, set
              // `ignoreFileExtensions` to an empty array.
              // ignoreFileExtensions: [],
            },
          },
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              classPrefix: "language-",
              inlineCodeMarker: null,
              aliases: {
                ts: "typescript",
                js: "javascript",
                py: "python",
                rb: "ruby",
                go: "golang",
                rs: "rust",
                kt: "kotlin",
                swift: "swift",
                java: "java",
                php: "php",
                c: "c",
                cpp: "cpp",
                cs: "csharp",
                sh: "bash",
                yml: "yaml",
                json: "json",
              },
              showLineNumbers: false,
              noInlineHighlight: false,
              languageExtensions: [
                {
                  language: "superscript",
                  extend: "javascript",
                  definition: {
                    superscript_types: /(SuperType)/,
                  },
                  insertBefore: {
                    function: {
                      superscript_keywords: /(superif|superelse)/,
                    },
                  },
                },
              ],
              prompt: {
                user: "root",
                host: "localhost",
                global: false,
              },
              escapeEntities: {},
            },
          },
        ],
      },
    },
  ],
};
