import React from "react";
import { Link, useStaticQuery, graphql } from "gatsby";
import "../styles/global.css";

const Layout = ({ pageTitle, children }) => {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  return (
    <div className="container mx-auto p-4">
      <header className="bg-gray-800 text-white p-4 text-center">
        <h1 className="text-3xl font-bold">{data.site.siteMetadata.title}</h1>
        <nav>
          <ul className="flex justify-center space-x-4">
            <li>
              <Link to="/" className="text-white no-underline hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-white no-underline hover:underline">
                About
              </Link>
            </li>
            <li>
              <a href="https://blog.iarunpaul.com" className="text-white no-underline hover:underline">
                Blogs
              </a>
            </li>
            <li>
              <Link to="/microblog" className="text-white no-underline hover:underline">
                MicroBlog
              </Link>
            </li>
          </ul>
        </nav>
      </header>
      <main>
        <h1 className="text-4xl font-bold mt-4">{pageTitle}</h1>
        {children}
      </main>
    </div>
  );
};

export default Layout;