// import React, { useEffect, useState } from "react";
// import { fetchCertifications } from "../utils/fetchCertifications";
// import { Link, graphql } from "gatsby";

// const IndexPage = ({ data }) => {
//   const [certifications, setCertifications] = useState([]);

//   useEffect(() => {
//     fetchCertifications().then((data) => setCertifications(data));
//   }, []);

//   return (
//     <div className="p-8">
//       <h1 className="text-4xl font-bold">Your Name</h1>
//       <p className="mt-4">Software Architect | Cloud Solutions Expert</p>

//       <h2 className="text-2xl font-bold mt-8">Microblogs</h2>
//       {data.allMarkdownRemark ? (
//         data.allMarkdownRemark.edges.map(({ node }) => (
//           <div key={node.id} className="mt-4">
//             <h3 className="text-xl font-semibold">{node.frontmatter.title}</h3>
//             <p className="text-gray-600">{node.frontmatter.date}</p>
//             <p>{node.excerpt}</p>
//           </div>
//         ))
//       ) : (
//         <p>No blog posts found.</p>
//       )}

//       <h2 className="text-2xl font-bold mt-8">Certifications</h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
//         {certifications.map((cert) => (
//           <div key={cert.id} className="border p-4 rounded-lg">
//             <img src={cert.badge_image} alt={cert.title} className="w-full" />
//             <h3 className="text-lg font-semibold mt-2">{cert.title}</h3>
//             <p className="text-gray-600">{cert.issued_at}</p>
//           </div>
//         ))}
//       </div>

//       <Link to="/projects" className="mt-8 inline-block text-blue-500">
//         View Projects →
//       </Link>
//     </div>
//   );
// };

// export const query = graphql`
//   query {
//     allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
//       edges {
//         node {
//           id
//           frontmatter {
//             title
//             date(formatString: "MMMM DD, YYYY")
//           }
//           excerpt
//         }
//       }
//     }
//   }
// `;

// export default IndexPage;
import React from "react";
import "../styles/global.css"; // Import your global CSS
import { Link } from 'gatsby';
import Layout from '../components/layout';
import { StaticImage } from 'gatsby-plugin-image';
import Seo from '../components/seo';

const IndexPage = () => {
  return (
    <Layout pageTitle="Home Page">
      <div className="container">
        <main>
          <h2>Under Construction</h2>
          <p>My website is currently under construction. Please check back soon!</p>
        </main>
        <StaticImage
          alt="Landing page image"
          src="..\images\homepic.webp"
        />
      </div>
    </Layout>
  );
};
export const Head = () => <Seo title="Home Page" />
export default IndexPage;