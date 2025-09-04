import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'

const OptimizedHomepageImage = ({ className = "", alt = "Landing page image" }) => {
  const data = useStaticQuery(graphql`
    query {
      homepicImage: file(relativePath: { eq: "homepic.webp" }) {
        childImageSharp {
          gatsbyImageData(
            width: 1792
            height: 1024
            placeholder: BLURRED
            formats: [AUTO, WEBP, AVIF]
            quality: 90
          )
        }
      }
    }
  `)

  const image = getImage(data.homepicImage)

  if (!image) {
    // Fallback to regular img if GraphQL fails
    return (
      <img
        src="homepic.webp" // Ensure image is in the public/ folder
        alt={alt}
        className={`w-full max-w-4xl ${className}`}
        loading="lazy"
        decoding="async"
      />
    )
  }

  return (
    <GatsbyImage
      image={image}
      alt={alt}
      className={className}
    />
  )
}

export default OptimizedHomepageImage