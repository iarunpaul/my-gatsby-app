// src/pages/index.js - HOMEPAGE WITH LINKEDIN MCP INTEGRATION

import React from "react"
import { Link } from "gatsby"
import Layout from "../components/layout"
import LinkedInMCPSummary from "../components/linkedin/LinkedInMCPSummary"

const IndexPage = () => {
  return (
    <Layout pageTitle="Home">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900">        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-white">{ }</span>
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
              Explore Articles
            </Link>
            <Link 
              to="/about" 
              className="border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-gray-900 px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Learn More
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

      {/* AI-Powered LinkedIn Activity Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Professional Activity & Insights
            </h2>
            <p className="text-xl text-gray-600">
              AI-powered analysis of recent LinkedIn activity and professional engagement
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* LinkedIn MCP Summary - Main Feature */}
            <div className="lg:col-span-2">
              <LinkedInMCPSummary 
                username="iarunpaul"
                autoRefresh={true}
                refreshInterval={300000} // 5 minutes
                className="mb-8"
              />
              
              {/* Additional Content */}
              <div className="bg-white rounded-lg shadow-md p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Featured Technical Articles</h3>
                
                <div className="space-y-6">
                  <article className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-semibold text-gray-900 mb-2">
                          Microservices Architecture Patterns
                        </h4>
                        <p className="text-gray-600 mb-3">
                          Exploring modern approaches to building scalable, maintainable 
                          distributed systems with practical implementation strategies.
                        </p>
                        <div className="flex items-center text-sm text-gray-500">
                          <span>5 min read</span>
                          <span className="mx-2">•</span>
                          <span>Architecture</span>
                          <span className="mx-2">•</span>
                          <span className="text-green-600">🤖 AI-Enhanced</span>
                        </div>
                      </div>
                    </div>
                  </article>
                  
                  <article className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-semibold text-gray-900 mb-2">
                          Cloud-Native Development with Kubernetes
                        </h4>
                        <p className="text-gray-600 mb-3">
                          Best practices for containerized applications and orchestration 
                          strategies for modern cloud deployments.
                        </p>
                        <div className="flex items-center text-sm text-gray-500">
                          <span>8 min read</span>
                          <span className="mx-2">•</span>
                          <span>DevOps</span>
                          <span className="mx-2">•</span>
                          <span className="text-blue-600">📊 Data-Driven</span>
                        </div>
                      </div>
                    </div>
                  </article>
                </div>
                
                <div className="mt-8 text-center">
                  <Link 
                    to="/microblog" 
                    className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200"
                  >
                    View All Articles
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Sidebar with Additional Features */}
            <div className="lg:col-span-1 space-y-8">
              
              {/* MCP Technology Showcase */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">🤖</span>
                  AI-Powered Features
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">LinkedIn MCP Integration</div>
                      <div className="text-sm text-gray-600">Real-time professional activity analysis</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Claude AI Summaries</div>
                      <div className="text-sm text-gray-600">Intelligent content generation and insights</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Dynamic Content Updates</div>
                      <div className="text-sm text-gray-600">Automated professional activity tracking</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Connect & Follow */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Connect & Follow
                </h3>
                
                <div className="space-y-4">
                  <a 
                    href="https://www.linkedin.com/in/arun-paul-polly-741042b9/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                  >
                    <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">LinkedIn</div>
                      <div className="text-sm text-gray-600">Professional updates & MCP data</div>
                    </div>
                  </a>
                  
                  <a 
                    href="https://github.com/iarunpaul"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="w-10 h-10 bg-gray-800 rounded flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">GitHub</div>
                      <div className="text-sm text-gray-600">Code repositories & MCP servers</div>
                    </div>
                  </a>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">AI</div>
                  <div className="text-gray-600">Powered</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">MCP</div>
                  <div className="text-gray-600">Integrated</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">Real-time</div>
                  <div className="text-gray-600">Updates</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Focus Areas */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Technology Focus Areas
            </h2>
            <p className="text-xl text-gray-600">
              Exploring the latest trends and innovations in software development
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-lg text-center hover:shadow-lg transition-shadow duration-300">
              <div className="text-6xl mb-4">☁️</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Cloud Architecture</h3>
              <p className="text-gray-600 mb-6">
                Scalable cloud-native solutions, containerization strategies, 
                and distributed systems design patterns for modern applications.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Kubernetes</span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Docker</span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Azure</span>
              </div>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-lg text-center hover:shadow-lg transition-shadow duration-300">
              <div className="text-6xl mb-4">🤖</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">AI Integration</h3>
              <p className="text-gray-600 mb-6">
                Model Context Protocol (MCP) implementations, AI-powered content 
                generation, and intelligent automation for modern workflows.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">MCP</span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Claude AI</span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Automation</span>
              </div>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-lg text-center hover:shadow-lg transition-shadow duration-300">
              <div className="text-6xl mb-4">⚡</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Modern Development</h3>
              <p className="text-gray-600 mb-6">
                Latest frameworks, development methodologies, and tools that 
                enhance productivity and code quality in software projects.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">TypeScript</span>
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">Angular</span>
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">DevOps</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold mb-6">
            Experience AI-Powered Professional Insights
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            This website showcases cutting-edge MCP integration with Claude AI for 
            real-time LinkedIn activity analysis and intelligent content generation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://linkedin.com/in/arun-paul-polly-741042b9"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              Connect on LinkedIn
            </a>
            <Link 
              to="/microblog" 
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Read AI-Enhanced Articles
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default IndexPage

// NO GRAPHQL QUERY - This file has zero GraphQL dependencies

