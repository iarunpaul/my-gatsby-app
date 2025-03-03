import React from "react";
import "../styles/global.css"; // Import your global CSS
import { Link } from 'gatsby';
import Layout from '../components/layout';
import { StaticImage } from 'gatsby-plugin-image';
import Seo from '../components/seo';

const IndexPage = () => {
  return (
    <Layout pageTitle="Home Page">
      <div className="container mx-auto p-8">
        <main className="text-center">
          <h2 className="text-4xl font-bold mb-4">Under Construction</h2>
          <p className="text-lg mb-8">My website is currently under construction. Please check back soon!</p>
          <StaticImage
            alt="Landing page image"
            src="../images/homepic.webp"
            className="mx-auto rounded-lg shadow-lg"
          />
        </main>
      </div>
    </Layout>
  );
};

export const Head = () => <Seo header="Home Page" />
export default IndexPage;