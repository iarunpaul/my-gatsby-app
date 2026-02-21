import * as React from 'react'
import Layout from '../components/layout'
import Seo from '../components/seo'
import { graphql, Link } from 'gatsby'

const MicroblogPost = ({ data, children }) => {
  const { title, date, tags } = data.mdx.frontmatter
  return (
    <Layout pageTitle={title}>
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Link to="/microblog" className="text-blue-500 hover:underline text-sm mb-6 inline-block">
          ← All MicroBlogs
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">{title}</h1>
        <p className="text-gray-500 text-sm mb-4">{date}</p>
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {tags.map(tag => (
              <span key={tag} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                {tag}
              </span>
            ))}
          </div>
        )}
        <hr className="border-gray-200 mb-8" />
        <div className="prose prose-lg">
          {children}
        </div>
      </div>
    </Layout>
  )
}

export const query = graphql`
  query($id: String) {
    mdx(id: { eq: $id }) {
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        tags
      }
    }
  }
`

export const Head = ({ data }) => <Seo header={data.mdx.frontmatter.title} />

export default MicroblogPost
