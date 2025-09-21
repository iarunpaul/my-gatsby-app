import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'

const ExamQuestionImage = ({
  questionNumber,
  imageIndex,
  originalUrl,
  alt,
  className = ""
}) => {
  // Query all AZ-204 exam images
  const data = useStaticQuery(graphql`
    query {
      allFile(filter: { sourceInstanceName: { eq: "images" }, relativeDirectory: { eq: "az-204-exam" } }) {
        nodes {
          relativePath
          name
          childImageSharp {
            gatsbyImageData(
              width: 800
              height: 600
              placeholder: BLURRED
              formats: [AUTO, WEBP, AVIF]
              quality: 85
              transformOptions: { fit: CONTAIN }
            )
          }
        }
      }
    }
  `)

  // Generate expected filename based on question number and image index
  const expectedFilename = `q${questionNumber.toString().padStart(3, '0')}_img${imageIndex.toString().padStart(2, '0')}`

  // Find the matching local image
  const localImage = data.allFile.nodes.find(node =>
    node.name === expectedFilename
  )

  // If we have a local optimized image, use it
  if (localImage && localImage.childImageSharp) {
    const image = getImage(localImage.childImageSharp)

    if (image) {
      return (
        <div className={`relative ${className}`}>
          <GatsbyImage
            image={image}
            alt={alt || `AZ-204 Question ${questionNumber} - Image ${imageIndex}`}
            className="rounded-lg border border-gray-200 shadow-sm"
            loading="lazy"
          />
          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
            ⚡ Optimized
          </div>
        </div>
      )
    }
  }

  // Fallback to original remote image
  return (
    <div className={`relative ${className}`}>
      <img
        src={originalUrl}
        alt={alt || `AZ-204 Question ${questionNumber} - Image ${imageIndex}`}
        className="max-w-full h-auto rounded-lg border border-gray-200 shadow-sm"
        loading="lazy"
        decoding="async"
        onError={(e) => {
          e.target.style.display = 'none'
          console.warn(`Failed to load image: ${originalUrl}`)
        }}
      />
      <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
        🌐 Remote
      </div>
    </div>
  )
}

export default ExamQuestionImage