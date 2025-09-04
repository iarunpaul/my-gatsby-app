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
    `gatsby-plugin-tailwindcss`, // Add Tailwind CSS support
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
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 800,
              quality: 90,
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
    },
    // Optional: Add sitemap
    `gatsby-plugin-sitemap`,
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [`.mdx`, `.md`],
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 800,
              quality: 90,
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
