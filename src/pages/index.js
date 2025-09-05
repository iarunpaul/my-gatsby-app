// src/pages/index.js - CLEAN VERSION WITH SINGLE QUERY
// Replace your entire index.js file with this code

import React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/Layout"

const IndexPage = ({ data }) => {
  // Handle case where data might not be available
  const recentPosts = data?.allMdx?.nodes || []

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900">        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-white">Tech</span>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Tech Innovation Hub
          </h1>
          
          <h2 className="text-2xl md:text-3xl mb-8 text-blue-300 font-light">
            Modern Software Architecture & Development
          </h2>
          
          <p className="text-xl mb-12 text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Exploring cutting-edge technologies and architectural patterns that drive 
            innovation in software development. From cloud-native solutions to 
            microservices and beyond.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/microblog" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors duration-300 transform hover:scale-105"
            >
              Read My Blog
            </Link>
            <Link 
              to="/about" 
              className="border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-gray-900 px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
            >
              About Me
            </Link>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      /* Recent Blog Posts */
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Recent Blog Posts
            </h2>
            <p className="text-xl text-gray-600">
              Latest thoughts on software architecture and technology
            </p>
          </div>
          
          {recentPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentPosts.map((post) => (
                <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      <Link
                        to={post.frontmatter?.slug ? `microblog/${post.frontmatter.slug}` : "#"}
                        className="hover:text-blue-600 transition-colors duration-300"
                      >
                        {post.frontmatter?.title || 'Untitled Post'}
                      </Link>
                    </h3>
                    
                    {post.frontmatter?.date && (
                      <p className="text-sm text-gray-500 mb-3">
                        {post.frontmatter.date}
                      </p>
                    )}
                    
                    <p className="text-gray-600 mb-4">
                      {post.excerpt || 'No excerpt available'}
                    </p>
                    
                    <Link
                      to={post.frontmatter?.slug ? `microblog/${post.frontmatter.slug}` : "#"}
                      className="text-blue-600 hover:text-blue-800 font-semibold text-sm flex items-center cursor-pointer"
                    >
                      Read More
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Blog Coming Soon</h3>
              <p className="text-gray-600 text-lg">I'm working on some exciting content about software architecture and modern development practices.</p>
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link 
              to="/microblog" 
              className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-lg font-semibold transition-colors duration-300 inline-flex items-center"
            >
              View All Posts
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Technology Stack
            </h2>
            <p className="text-xl text-gray-300">
              Modern tools and frameworks shaping software development
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {[
              { name: "TypeScript", icon: "📜" },
              { name: "Angular", icon: "🅰️" },
              { name: "Python", icon: "🐍" },
              { name: "Docker", icon: "🐳" },
              { name: "Kubernetes", icon: "⛵" },
              { name: "Azure", icon: "☁️" },
              { name: "Bicep", icon: "💪" },
              { name: "Kotlin", icon: "📱" },
              { name: "Java", icon: "☕" },
              { name: "C#", icon: "🔷" },
              { name: "Bash", icon: "🖥️" },
              { name: "Nx", icon: "📦" }
            ].map((tech) => (
              <div key={tech.name} className="text-center group cursor-pointer">
                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">
                  {tech.icon}
                </div>
                <div className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors duration-300">
                  {tech.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            About Me
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            I'm a passionate software architect with expertise in cloud technologies, 
            microservices architecture, and modern development practices. I love building 
            scalable solutions and sharing knowledge through writing and open-source contributions.
          </p>
          <Link 
            to="/about" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors duration-300 inline-flex items-center"
          >
            Learn More About Me
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold mb-6">
            Let's Connect
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Whether you're looking for technical consultation, collaboration on a project, 
            or just want to discuss the latest in software architecture, I'd love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:your-email@example.com" 
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold transition-colors duration-300"
            >
              Get In Touch
            </a>
            <a 
              href="https://www.linkedin.com/in/arun-paul-polly-741042b9/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-lg font-semibold transition-all duration-300"
            >
              Connect on LinkedIn
            </a>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default IndexPage

// SINGLE GraphQL query - only one export allowed per file
export const query = graphql`
  query {
    allMdx(
      limit: 6
    ) {
      nodes {
        id
        frontmatter {
          title
          date(formatString: "MMMM DD, YYYY")
          slug
        }
        excerpt(pruneLength: 150)
      }
    }
  }
`
