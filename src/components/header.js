// src/components/header.js
import React from "react";
import { Link } from "gatsby";

const Header = () => {
  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          Your Name
        </Link>
        <nav>
          <Link to="/projects" className="mr-4">
            Projects
          </Link>
          <a href="https://blog.iarunpaul.com" target="_blank" rel="noopener noreferrer">
            Blog
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;