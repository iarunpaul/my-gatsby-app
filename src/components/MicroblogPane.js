import React from "react"
import { Link } from "gatsby"

const MicroblogPane = ({ posts }) => {
  if (!posts || posts.length === 0) return null

  return (
    <section className="bg-gray-900 border-b border-gray-700 py-3">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-4">

          {/* Label */}
          <Link
            to="/microblog"
            className="text-blue-400 font-semibold text-xs uppercase tracking-widest whitespace-nowrap flex items-center gap-1.5 flex-shrink-0 hover:text-blue-300 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H9v-2.414a2 2 0 01.586-1.414z" />
            </svg>
            MicroBlogs
          </Link>

          {/* Divider */}
          <div className="w-px h-5 bg-gray-600 flex-shrink-0" />

          {/* Scrollable link strip */}
          <div className="flex gap-6 overflow-x-auto scrollbar-hide flex-1 min-w-0">
            {posts.map(post => (
              <Link
                key={post.frontmatter.slug}
                to={`/microblog/${post.frontmatter.slug}`}
                className="whitespace-nowrap text-sm text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2 group py-0.5"
              >
                <span className="text-gray-600 text-xs">{post.frontmatter.date}</span>
                <span className="text-gray-600">·</span>
                <span className="group-hover:text-white transition-colors">{post.frontmatter.title}</span>
              </Link>
            ))}
          </div>

          {/* View all */}
          <Link
            to="/microblog"
            className="flex-shrink-0 text-xs text-gray-500 hover:text-blue-400 transition-colors whitespace-nowrap ml-2"
          >
            View all →
          </Link>

        </div>
      </div>
    </section>
  )
}

export default MicroblogPane
