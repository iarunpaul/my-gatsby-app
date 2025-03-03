import * as React from 'react'
import Layout from '../../components/layout'
import Seo from '../../components/seo'
import { graphql } from 'gatsby'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'

const BlogPost = ({ data, children }) => {
  const image = getImage(data.mdx.frontmatter.hero_image)
  return (
    <Layout pageTitle={data.mdx.frontmatter.title}>
      <div className="container mx-auto p-8">
        <p className="text-gray-600 text-center mb-4">{data.mdx.frontmatter.date}</p>
        <div className="flex justify-center mb-4">
          <GatsbyImage
            image={image}
            alt={data.mdx.frontmatter.hero_image_alt}
            className="rounded-lg shadow-lg w-1/2"
          />
        </div>
        <p className="text-sm text-gray-500 text-center mb-8">
          Photo Credit:{" "}
          <a href={data.mdx.frontmatter.hero_image_credit_link} className="text-blue-500 hover:underline">
            {data.mdx.frontmatter.hero_image_credit_text}
          </a>
        </p>
        <div className="prose prose-lg mx-auto">
          {children}
        </div>
      </div>
    </Layout>
  )
}

export const query = graphql`
  query($id: String) {
    mdx(id: {eq: $id}) {
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        hero_image_alt
        hero_image_credit_link
        hero_image_credit_text
        hero_image {
          childImageSharp {
            gatsbyImageData
          }
        }
      }
    }
  }
`
export const Head = ({ data }) => <Seo header={data.mdx.frontmatter.title} />

export default BlogPost