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

// Callout component for highlighted notes, insights, warnings, etc.
const Callout = ({ type = "info", children }) => {
  const styles = {
    insight: { border: "border-l-blue-500", bg: "bg-blue-50", icon: "\u{1F4A1}", title: "Key Insight" },
    warning: { border: "border-l-yellow-500", bg: "bg-yellow-50", icon: "\u26A0\uFE0F", title: "Warning" },
    info:    { border: "border-l-gray-500", bg: "bg-gray-50", icon: "\u2139\uFE0F", title: "Info" },
    tip:     { border: "border-l-green-500", bg: "bg-green-50", icon: "\u2705", title: "Tip" },
    danger:  { border: "border-l-red-500", bg: "bg-red-50", icon: "\u{1F6A8}", title: "Danger" },
  }
  const s = styles[type] || styles.info

  return (
    <div className={`${s.bg} ${s.border} border-l-4 rounded-r-lg p-4 my-6`}>
      <p className="font-semibold mb-1">{s.icon} {s.title}</p>
      <div className="text-sm text-gray-800">{children}</div>
    </div>
  )
}

// Table components so markdown tables render with proper styling in MDX
const Table = (props) => (
  <div className="overflow-x-auto my-6">
    <table className="min-w-full border-collapse border border-gray-300 text-sm" {...props} />
  </div>
)
const Thead = (props) => <thead className="bg-gray-100" {...props} />
const Tbody = (props) => <tbody className="divide-y divide-gray-200" {...props} />
const Tr = (props) => <tr className="hover:bg-gray-50" {...props} />
const Th = (props) => <th className="border border-gray-300 px-4 py-2 text-left font-semibold" {...props} />
const Td = (props) => <td className="border border-gray-300 px-4 py-2" {...props} />

// Export components for use in MDX
const mdxComponents = {
  CustomImage,
  ImageGallery,
  FloatingImage,
  SimpleImage,
  ImageComparison,
  Callout,
  // Override native HTML table elements so markdown tables render styled
  table: Table,
  thead: Thead,
  tbody: Tbody,
  tr: Tr,
  th: Th,
  td: Td,
}

export default mdxComponents
export {
  CustomImage,
  ImageGallery,
  FloatingImage,
  SimpleImage,
  ImageComparison,
  Callout
}
