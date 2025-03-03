import * as React from 'react'
import { graphql, useStaticQuery } from 'gatsby'

const Seo = ({ header = "Default Page" }) => {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <title>{header} | {data.site.siteMetadata.title}</title>
  )
}

export default Seo