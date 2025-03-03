import * as React from "react"
import { Link } from "gatsby"
import "../styles/global.css" // Ensure Tailwind CSS is imported

const NotFoundPage = () => {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800 p-8">
      <h1 className="text-4xl font-bold mb-8">Page not found</h1>
      <p className="text-lg mb-8 text-center">
        Sorry 😔, we couldn’t find what you were looking for.
        <br />
        {process.env.NODE_ENV === "development" ? (
          <>
            <br />
            Try creating a page in <code className="bg-yellow-100 text-yellow-800 p-1 rounded">src/pages/</code>.
            <br />
          </>
        ) : null}
        <br />
        <Link to="/" className="text-blue-500 hover:underline">Go home</Link>.
      </p>
    </main>
  )
}

export default NotFoundPage

export const Head = () => <title>Not found</title>