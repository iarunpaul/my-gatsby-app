import React from 'react'
import { MDXProvider } from '@mdx-js/react'
import mdxComponents from './src/components/mdx-components'

// Wrap all pages with MDXProvider for server-side rendering
export const wrapRootElement = ({ element }) => (
  <MDXProvider components={mdxComponents}>
    {element}
  </MDXProvider>
)
