const path = require("path")

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage, createRedirect } = actions

  const blogTemplate = path.resolve("src/templates/blog-post.js")
  const microblogTemplate = path.resolve("src/templates/microblog-post.js")

  const result = await graphql(`
    query {
      blogs: allMdx(
        filter: { internal: { contentFilePath: { regex: "/src/blogs/" } } }
        sort: { frontmatter: { date: DESC } }
      ) {
        nodes {
          id
          internal { contentFilePath }
          frontmatter { slug }
        }
      }
      microblogs: allMdx(
        filter: { internal: { contentFilePath: { regex: "/src/microblogs/" } } }
        sort: { frontmatter: { date: DESC } }
      ) {
        nodes {
          id
          internal { contentFilePath }
          frontmatter { slug }
        }
      }
    }
  `)

  if (result.errors) {
    reporter.panicOnBuild("Error loading MDX for page creation", result.errors)
    return
  }

  // Create /blog/:slug pages and redirect old /microblog/:slug → /blog/:slug
  result.data.blogs.nodes.forEach(node => {
    const slug = node.frontmatter.slug
    createPage({
      path: `/blog/${slug}`,
      component: `${blogTemplate}?__contentFilePath=${node.internal.contentFilePath}`,
      context: { id: node.id },
    })
    createRedirect({
      fromPath: `/microblog/${slug}`,
      toPath: `/blog/${slug}`,
      isPermanent: true,
    })
  })

  // Create /microblog/:slug pages
  result.data.microblogs.nodes.forEach(node => {
    const slug = node.frontmatter.slug
    createPage({
      path: `/microblog/${slug}`,
      component: `${microblogTemplate}?__contentFilePath=${node.internal.contentFilePath}`,
      context: { id: node.id },
    })
  })
}
