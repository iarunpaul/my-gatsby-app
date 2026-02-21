import * as React from 'react'
import Layout from '../../components/layout'
import Seo from '../../components/seo'
import { Link, graphql } from 'gatsby'

const MicroblogPage = ({ data }) => {
    const posts = data.allMdx.nodes
    return (
        <Layout pageTitle="MicroBlog">
            <div className="max-w-3xl mx-auto px-6 py-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">MicroBlogs</h1>
                <p className="text-gray-500 mb-10">Short thoughts, quick tips, and focused reads.</p>
                {posts.length === 0 ? (
                    <p className="text-gray-400 text-center py-16">No microblogs yet — check back soon!</p>
                ) : (
                    posts.map((node) => (
                        <article key={node.id} className="mb-8 pb-8 border-b border-gray-200 last:border-b-0">
                            <h2 className="text-xl font-semibold mb-1">
                                <Link to={`/microblog/${node.frontmatter.slug}`} className="text-blue-600 hover:underline">
                                    {node.frontmatter.title}
                                </Link>
                            </h2>
                            <p className="text-gray-400 text-sm mb-2">{node.frontmatter.date}</p>
                            {node.frontmatter.tags && node.frontmatter.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-2">
                                    {node.frontmatter.tags.map(tag => (
                                        <span key={tag} className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                            <p className="text-gray-600 text-sm">{node.excerpt}</p>
                        </article>
                    ))
                )}
            </div>
        </Layout>
    )
}

export const query = graphql`
  query {
    allMdx(
      filter: { internal: { contentFilePath: { regex: "/src/microblogs/" } } }
      sort: { frontmatter: { date: DESC } }
    ) {
      nodes {
        frontmatter {
          date(formatString: "MMMM D, YYYY")
          title
          slug
          tags
        }
        id
        excerpt
      }
    }
  }
`

export const Head = () => <Seo header="MicroBlogs" />
export default MicroblogPage
