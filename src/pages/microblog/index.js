import * as React from 'react'
import Layout from '../../components/layout'
import Seo from '../../components/seo'
import { Link, graphql } from 'gatsby'

const MicroblogPage = ({ data }) => {
    return (
        <Layout pageTitle="My Micro-Blogs">
            <div className="container mx-auto p-8">
                {
                    data.allMdx.nodes.map((node) => (
                    <article key={node.id} className="mb-8">
                      <h2 className="text-2xl font-bold text-center mb-2">
                        <Link to={`/microblog/${node.frontmatter.slug}`} className="text-blue-500 hover:underline">
                          {node.frontmatter.title}
                        </Link>
                      </h2>
                        <p className="text-gray-600 text-center mb-2">Posted: {node.frontmatter.date}</p>
                        <p className="text-center">{node.excerpt}</p>
                    </article>
                    ))
                }
            </div>
        </Layout>
    )
}

export const query = graphql`
  query {
    allMdx(sort: { frontmatter: { date: DESC }}) {
      nodes {
        frontmatter {
          date(formatString: "MMMM D, YYYY")
          title
          slug
        }
        id
        excerpt
      }
    }
  }
`

export const Head = () => <Seo header="My Micro-Blogs" />
export default MicroblogPage