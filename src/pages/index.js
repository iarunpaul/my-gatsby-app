import React from "react";
import "../styles/global.css"; // Import your global CSS
import { Link, graphql } from 'gatsby';
import Layout from '../components/layout';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import Seo from '../components/seo';

const IndexPage = ({ data }) => {
  const image = getImage(data.homepicImage)
  
  return (
    <Layout pageTitle="Home Page">
      <div className="container mx-auto p-8">
        <main className="text-center">
          <h2 className="text-4xl font-bold mb-4">Under Construction</h2>
          <p className="text-lg mb-8">My website is currently under construction. Please check back soon!</p>
          
          {image ? (
            <GatsbyImage
              image={image}
              alt="Landing page image"
              className="mx-auto rounded-lg shadow-lg"
            />
          ) : (
            // Fallback if GraphQL fails
            <img
              src="/homepic.webp"
              alt="Landing page image"
              className="mx-auto rounded-lg shadow-lg w-full max-w-4xl"
            />
          )}
        </main>
      </div>
    </Layout>
  );
};

// GraphQL query to get the optimized image
export const query = graphql`
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
`

export const Head = () => <Seo header="Home Page" />
export default IndexPage;
