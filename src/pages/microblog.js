import * as React from 'react'
import Layout from '../components/layout'
import Seo from '../components/seo'
import { graphql } from 'gatsby'

const MicroblogPage = ({ data }) => {
    return (
        <Layout pageTitle="My Blog Posts">
            <ul>
                {
                    data.allFile.nodes.map(node => (
                        <li key={node.name}>
                            {node.name}
                        </li>
                    ))
                }
            </ul>
        </Layout>
    )
}

export const query = graphql`
  query {
        allFile(filter: {sourceInstanceName: {eq: "microblogs"}}) {
            nodes {
            name
            }
        }
    }
`

export const Head = () => <Seo title="My Blog Posts" />

export default MicroblogPage