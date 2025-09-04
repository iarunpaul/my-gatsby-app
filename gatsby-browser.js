import "./src/styles/global.css"
import "prismjs/themes/prism-tomorrow.css"  // This adds the syntax highlighting!
import "prismjs/plugins/command-line/prism-command-line.css"

import React from 'react'
import { MDXProvider } from '@mdx-js/react'
import mdxComponents from './src/components/mdx-components'

// Wrap all pages with MDXProvider to make components available
export const wrapRootElement = ({ element }) => (
  <MDXProvider components={mdxComponents}>
    {element}
  </MDXProvider>
)
