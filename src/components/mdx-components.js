import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'

// Helper function to resolve image path
const useImageByPath = (imagePath) => {
  const data = useStaticQuery(graphql`
    query {
      allFile(filter: { extension: { regex: "/(jpg|jpeg|png|gif|webp)/" } }) {
        nodes {
          relativePath
          childImageSharp {
            gatsbyImageData(
              width: 800
              placeholder: BLURRED
              formats: [AUTO, WEBP, AVIF]
            )
          }
        }
      }
    }
  `)

  // Remove leading ./ from path
  const cleanPath = imagePath.replace(/^\.\//, '')
  
  // Find the image in the query results
  const imageNode = data.allFile.nodes.find(node => 
    node.relativePath.includes(cleanPath) || 
    node.relativePath.endsWith(cleanPath)
  )

  return imageNode ? getImage(imageNode.childImageSharp) : null
}

// Custom Image component that works with Gatsby's image processing
const CustomImage = ({ src, alt, caption, className = "", width = "100%" }) => {
  const image = useImageByPath(src)
  
  if (image) {
    return (
      <figure className={`my-6 ${className}`} style={{ width }}>
        <GatsbyImage
          image={image}
          alt={alt}
          className="rounded-lg shadow-lg"
        />
        {caption && (
          <figcaption className="text-sm text-gray-600 text-center mt-2 italic">
            {caption}
          </figcaption>
        )}
      </figure>
    )
  }

  // Fallback to regular img if image not found in GraphQL
  return (
    <figure className={`my-6 ${className}`} style={{ width }}>
      <img 
        src={src} 
        alt={alt} 
        className="rounded-lg shadow-lg w-full h-auto"
        loading="lazy"
      />
      {caption && (
        <figcaption className="text-sm text-gray-600 text-center mt-2 italic">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

// Image Gallery component with Gatsby image processing
const ImageGallery = ({ images, columns = 2 }) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  }

  return (
    <div className={`grid ${gridCols[columns]} gap-4 my-8`}>
      {images.map((imageData, index) => {
        const image = useImageByPath(imageData.src)
        
        return (
          <div key={index} className="relative">
            {image ? (
              <GatsbyImage
                image={image}
                alt={imageData.alt || `Gallery image ${index + 1}`}
                className="rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              />
            ) : (
              <img
                src={imageData.src}
                alt={imageData.alt || `Gallery image ${index + 1}`}
                className="w-full h-auto rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                loading="lazy"
              />
            )}
            {imageData.caption && (
              <p className="text-sm text-gray-600 text-center mt-2">
                {imageData.caption}
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}

// Floating image component with Gatsby processing
const FloatingImage = ({ 
  src, 
  alt, 
  caption, 
  position = "right", 
  width = "300px",
  className = "" 
}) => {
  const positionClass = position === "left" ? "float-left mr-4" : "float-right ml-4"
  const image = useImageByPath(src)
  
  return (
    <figure 
      className={`${positionClass} mb-4 ${className}`} 
      style={{ width, maxWidth: "50%" }}
    >
      {image ? (
        <GatsbyImage
          image={image}
          alt={alt}
          className="rounded-lg shadow-md"
        />
      ) : (
        <img
          src={src}
          alt={alt}
          className="w-full h-auto rounded-lg shadow-md"
          loading="lazy"
        />
      )}
      {caption && (
        <figcaption className="text-xs text-gray-600 text-center mt-1 italic">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

// Simple components that work with absolute paths or URLs
const SimpleImage = ({ src, alt, caption, className = "", width = "100%" }) => {
  return (
    <figure className={`my-6 ${className}`} style={{ width }}>
      <img 
        src={src} 
        alt={alt} 
        className="rounded-lg shadow-lg w-full h-auto"
        loading="lazy"
      />
      {caption && (
        <figcaption className="text-sm text-gray-600 text-center mt-2 italic">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

// Image comparison component
const ImageComparison = ({ beforeImage, afterImage, beforeLabel = "Before", afterLabel = "After" }) => {
  const beforeImg = useImageByPath(beforeImage.src)
  const afterImg = useImageByPath(afterImage.src)

  return (
    <div className="my-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="text-center">
          <h4 className="text-lg font-semibold mb-2">{beforeLabel}</h4>
          {beforeImg ? (
            <GatsbyImage
              image={beforeImg}
              alt={beforeImage.alt}
              className="rounded-lg shadow-md"
            />
          ) : (
            <img
              src={beforeImage.src}
              alt={beforeImage.alt}
              className="w-full h-auto rounded-lg shadow-md"
              loading="lazy"
            />
          )}
        </div>
        <div className="text-center">
          <h4 className="text-lg font-semibold mb-2">{afterLabel}</h4>
          {afterImg ? (
            <GatsbyImage
              image={afterImg}
              alt={afterImage.alt}
              className="rounded-lg shadow-md"
            />
          ) : (
            <img
              src={afterImage.src}
              alt={afterImage.alt}
              className="w-full h-auto rounded-lg shadow-md"
              loading="lazy"
            />
          )}
        </div>
      </div>
    </div>
  )
}

// Export components for use in MDX
const mdxComponents = {
  CustomImage,
  ImageGallery,
  FloatingImage,
  SimpleImage,
  ImageComparison,
}

export default mdxComponents
export { 
  CustomImage, 
  ImageGallery, 
  FloatingImage, 
  SimpleImage,
  ImageComparison 
}
