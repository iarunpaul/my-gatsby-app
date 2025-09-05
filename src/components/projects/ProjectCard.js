// import React, { useState } from "react"
// import { GatsbyImage, getImage } from "gatsby-plugin-image"
// import { Link } from "gatsby"

// const ProjectCard = ({ project }) => {
//   const [isHovered, setIsHovered] = useState(false)
//   const image = getImage(project.frontmatter.hero_image)
  
//   return (
//     <div 
//       className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       {/* Project Image/Demo Preview */}
//       <div className="relative h-48 overflow-hidden">
//         {image && (
//           <GatsbyImage 
//             image={image} 
//             alt={project.frontmatter.title}
//             className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
//           />
//         )}
        
//         {/* Overlay with action buttons */}
//         <div className={`absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center space-x-4 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
//           {project.frontmatter.slug && (
//             <a
//               href={`microblog/${project.frontmatter.slug}`}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-300 flex items-center"
//             >
//               <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
//               </svg>
//               Live Demo
//             </a>
//           )}
          
//           {project.frontmatter.slug && (
//             <a
//               href={`microblog/${project.frontmatter.slug}`}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-300 flex items-center"
//             >
//               <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
//                 <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
//               </svg>
//               Code
//             </a>
//           )}
//         </div>
        
//         {/* Project Status Badge */}
//         <div className="absolute top-4 right-4">
//           <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
//             project.frontmatter.status === 'live' 
//               ? 'bg-green-100 text-green-800' 
//               : project.frontmatter.status === 'development'
//               ? 'bg-yellow-100 text-yellow-800'
//               : 'bg-gray-100 text-gray-800'
//           }`}>
//             {project.frontmatter.featured || 'Completed'}
//           </span>
//         </div>
//       </div>

//       {/* Project Content */}
//       <div className="p-6">
//         <div className="flex items-start justify-between mb-3">
//           <h3 className="text-xl font-bold text-gray-900 font-space-grotesk">
//             {project.frontmatter.title}
//           </h3>
//           <div className="flex items-center text-sm text-gray-500">
//             <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//             </svg>
//             {project.frontmatter.year}
//           </div>
//         </div>
        
//         <p className="text-gray-600 mb-4 line-clamp-3">
//           {project.frontmatter.description}
//         </p>
        
//         {/* Technology Stack */}
//         <div className="mb-4">
//           <div className="flex flex-wrap gap-2">
//             {project.frontmatter.tags?.map((tech) => (
//               <span 
//                 key={tech}
//                 className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-md"
//               >
//                 {tech}
//               </span>
//             ))}
//           </div>
//         </div>
        
//         {/* Project Metrics */}
//         {project.frontmatter.metrics && (
//           <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
//             {project.frontmatter.metrics.users && (
//               <div className="text-center">
//                 <div className="text-lg font-bold text-gray-900">
//                   {project.frontmatter.metrics.users}
//                 </div>
//                 <div className="text-xs text-gray-500">Users</div>
//               </div>
//             )}
//             {project.frontmatter.metrics.performance && (
//               <div className="text-center">
//                 <div className="text-lg font-bold text-gray-900">
//                   {project.frontmatter.metrics.performance}
//                 </div>
//                 <div className="text-xs text-gray-500">Performance</div>
//               </div>
//             )}
//             {project.frontmatter.metrics.uptime && (
//               <div className="text-center">
//                 <div className="text-lg font-bold text-gray-900">
//                   {project.frontmatter.metrics.uptime}
//                 </div>
//                 <div className="text-xs text-gray-500">Uptime</div>
//               </div>
//             )}
//           </div>
//         )}
        
//         {/* Action Buttons */}
//         <div className="flex items-center justify-between">
//           <Link 
//             to={`/projects/${project.frontmatter.slug}`}
//             className="text-blue-600 hover:text-blue-800 font-semibold text-sm flex items-center"
//           >
//             Read Case Study
//             <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//             </svg>
//           </Link>
          
//           <div className="flex items-center space-x-2">
//             {project.frontmatter.githubStars && (
//               <div className="flex items-center text-sm text-gray-500">
//                 <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
//                   <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                 </svg>
//                 {project.frontmatter.githubStars}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// // src/pages/projects.js - Projects Showcase Page
// import React, { useState, useMemo } from "react"
// import { graphql } from "gatsby"
// import Layout from "../components/Layout"
// import SEO from "../components/SEO"
// import ProjectCard from "../components/projects/ProjectCard"

// const ProjectsPage = ({ data }) => {
//   const [selectedCategory, setSelectedCategory] = useState('all')
//   const [selectedTech, setSelectedTech] = useState('all')
  
//   const projects = data.allMdx.nodes
  
//   // Extract unique categories and technologies
//   const categories = useMemo(() => {
//     const cats = new Set(['all'])
//     projects.forEach(project => {
//       if (project.frontmatter.category) {
//         cats.add(project.frontmatter.category)
//       }
//     })
//     return Array.from(cats)
//   }, [projects])
  
//   const technologies = useMemo(() => {
//     const techs = new Set(['all'])
//     projects.forEach(project => {
//       project.frontmatter.technologies?.forEach(tech => techs.add(tech))
//     })
//     return Array.from(techs)
//   }, [projects])
  
//   // Filter projects based on selected filters
//   const filteredProjects = useMemo(() => {
//     return projects.filter(project => {
//       const categoryMatch = selectedCategory === 'all' || project.frontmatter.category === selectedCategory
//       const techMatch = selectedTech === 'all' || project.frontmatter.technologies?.includes(selectedTech)
//       return categoryMatch && techMatch
//     })
//   }, [projects, selectedCategory, selectedTech])

//   return (
//     <Layout>
//       <SEO 
//         title="Projects & Demos | Arun Paul"
//         description="Explore my portfolio of software projects, live demos, and technical case studies showcasing modern web development and cloud architecture."
//       />
      
//       {/* Hero Section */}
//       <section className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white py-20">
//         <div className="max-w-7xl mx-auto px-6 text-center">
//           <h1 className="text-5xl font-bold mb-6 font-space-grotesk">
//             Projects & Demos
//           </h1>
//           <p className="text-xl text-gray-300 max-w-3xl mx-auto">
//             A showcase of my work in software architecture, web development, and cloud solutions. 
//             Each project includes live demos, source code, and detailed case studies.
//           </p>
//         </div>
//       </section>

//       {/* Filters */}
//       <section className="bg-white py-8 border-b">
//         <div className="max-w-7xl mx-auto px-6">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
//             {/* Category Filter */}
//             <div className="flex items-center space-x-4">
//               <span className="text-sm font-medium text-gray-700">Category:</span>
//               <div className="flex flex-wrap gap-2">
//                 {categories.map(category => (
//                   <button
//                     key={category}
//                     onClick={() => setSelectedCategory(category)}
//                     className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
//                       selectedCategory === category
//                         ? 'bg-blue-600 text-white'
//                         : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                     }`}
//                   >
//                     {category.charAt(0).toUpperCase() + category.slice(1)}
//                   </button>
//                 ))}
//               </div>
//             </div>
            
//             {/* Technology Filter */}
//             <div className="flex items-center space-x-4">
//               <span className="text-sm font-medium text-gray-700">Technology:</span>
//               <select
//                 value={selectedTech}
//                 onChange={(e) => setSelectedTech(e.target.value)}
//                 className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 {technologies.map(tech => (
//                   <option key={tech} value={tech}>
//                     {tech.charAt(0).toUpperCase() + tech.slice(1)}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
          
//           {/* Results Count */}
//           <div className="mt-4 text-sm text-gray-600">
//             Showing {filteredProjects.length} of {projects.length} projects
//           </div>
//         </div>
//       </section>

//       {/* Projects Grid */}
//       <section className="py-16 bg-gray-50">
//         <div className="max-w-7xl mx-auto px-6">
//           {filteredProjects.length > 0 ? (
//             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//               {filteredProjects.map((project) => (
//                 <ProjectCard key={project.id} project={project} />
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-12">
//               <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.5-.816-6.207-2.175C5.25 12.09 5.25 11.91 5.25 11.709V6.375c0-1.036.84-1.875 1.875-1.875h8.25c1.035 0 1.875.84 1.875 1.875v5.334c0 .201 0 .381-.543 1.116A7.962 7.962 0 0112 15z" />
//               </svg>
//               <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
//               <p className="text-gray-600">Try adjusting your filters to see more projects.</p>
//             </div>
//           )}
//         </div>
//       </section>

//       {/* Call to Action */}
//       <section className="bg-blue-600 text-white py-16">
//         <div className="max-w-4xl mx-auto text-center px-6">
//           <h2 className="text-3xl font-bold mb-4 font-space-grotesk">
//             Interested in Working Together?
//           </h2>
//           <p className="text-xl mb-8 text-blue-100">
//             I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions.
//           </p>
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <Link 
//               to="/contact" 
//               className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors duration-300"
//             >
//               Start a Project
//             </Link>
//             <a 
//               href="mailto:arun@example.com" 
//               className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold transition-all duration-300"
//             >
//               Send Email
//             </a>
//           </div>
//         </div>
//       </section>
//     </Layout>
//   )
// }

// export default ProjectsPage

// // export const query = graphql`
// //   query {
// //     allMdx(
// //       filter: { frontmatter: { type: { eq: "project" } } }
// //       sort: { frontmatter: { date: DESC } }
// //     ) {
// //       nodes {
// //         id
// //         frontmatter {
// //           title
// //           description
// //           category
// //           technologies
// //           demoUrl
// //           githubUrl
// //           slug
// //           year: date(formatString: "YYYY")
// //           status
// //           githubStars
// //           metrics {
// //             users
// //             performance
// //             uptime
// //           }
// //           image {
// //             childImageSharp {
// //               gatsbyImageData(width: 400, height: 300, placeholder: BLURRED)
// //             }
// //           }
// //         }
// //       }
// //     }
// //   }
// // `
// const query = graphql`
//     query {
//     allMdx(
//       filter: { frontmatter: { type: { eq: "project" } } }
//       sort: { frontmatter: { date: DESC } }
//     ) {
//       nodes {
//         id
//         frontmatter {
//           title
//           description
//           slug
//           year: date(formatString: "YYYY")

//           hero_image {
//             childImageSharp {
//               gatsbyImageData(width: 400, height: 300, placeholder: BLURRED)
//             }
//           }
//         }
//       }
//     }
//   }`

// export { ProjectCard }
