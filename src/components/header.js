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
        <nav className="flex items-center gap-6">
          <Link to="/blog" className="hover:text-blue-200 transition-colors">
            Blogs
          </Link>
          <a href="/#personal-lounge"
            className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg font-medium transition-colors">
            Personal Lounge
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;