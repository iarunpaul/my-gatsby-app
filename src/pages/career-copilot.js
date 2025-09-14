import React, { useState, useRef, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import Layout from '../components/layout'

const CareerCopilotPage = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: `👋 Welcome to AI Career Copilot! I can help you with:

🔍 **Job Search** - Find jobs across multiple platforms including LinkedIn
📊 **Resume Scoring** - Analyze how well your resume matches job requirements  
✍️ **Cover Letters** - Generate personalized cover letters for specific jobs
📱 **LinkedIn Posts** - Create engaging professional content

Just tell me what you'd like to do! For example:
• "Find software engineer jobs in San Francisco"
• "Score my resume against these jobs"
• "Write a cover letter for this position"
• "Create a LinkedIn post about my new project"`
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!inputValue.trim() || isLoading) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue.trim()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/career-copilot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          conversationHistory: messages
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: data.response,
        toolUsed: data.toolUsed,
        executionTime: data.executionTime
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error:', error)
      const errorMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: `❌ Sorry, I encountered an error: ${error.message}. Please try again or contact support if the issue persists.`
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const formatMessage = (content) => {
    // Convert markdown-like formatting to JSX
    return content.split('\n').map((line, index) => {
      if (line.startsWith('##')) {
        return <h3 key={index} className="text-lg font-semibold mt-4 mb-2 text-blue-600">{line.replace('##', '').trim()}</h3>
      }
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={index} className="font-semibold mb-2">{line.replace(/\*\*/g, '')}</p>
      }
      if (line.startsWith('- ')) {
        return <li key={index} className="ml-4 mb-1">{line.replace('- ', '')}</li>
      }
      if (line.trim() === '') {
        return <br key={index} />
      }
      return <p key={index} className="mb-2">{line}</p>
    })
  }

  const examplePrompts = [
    "Find remote software engineer jobs",
    "Score my resume against tech jobs",
    "Write a cover letter for a React developer position",
    "Create a LinkedIn post about completing a coding bootcamp"
  ]

  const handleExampleClick = (prompt) => {
    setInputValue(prompt)
  }

  return (
    <Layout>
      <Helmet>
        <title>AI Career Copilot Demo | Your Personal Career Assistant</title>
        <meta name="description" content="Try our AI Career Copilot - get job recommendations, resume scoring, cover letter generation, and LinkedIn content creation powered by Claude AI." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              🤖 AI Career Copilot Demo
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience the power of AI-driven career assistance. Search jobs, analyze resumes, 
              generate cover letters, and create LinkedIn content - all through natural conversation.
            </p>
          </div>

          {/* Chat Container */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  🤖
                </div>
                <div>
                  <h2 className="font-semibold">AI Career Assistant</h2>
                  <p className="text-sm opacity-90">Powered by Claude AI & Real Job APIs</p>
                </div>
                <div className="ml-auto">
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Online</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <div className="text-sm">
                      {typeof message.content === 'string' 
                        ? formatMessage(message.content)
                        : message.content
                      }
                    </div>
                    {message.toolUsed && (
                      <div className="mt-2 text-xs opacity-70">
                        🔧 Used: {message.toolUsed} {message.executionTime && `(${message.executionTime}ms)`}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 max-w-xs lg:max-w-md px-4 py-3 rounded-2xl">
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="text-sm">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Example Prompts */}
            {messages.length <= 1 && (
              <div className="px-4 pb-4">
                <p className="text-sm text-gray-600 mb-2">Try these examples:</p>
                <div className="flex flex-wrap gap-2">
                  {examplePrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => handleExampleClick(prompt)}
                      className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1 rounded-full transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="border-t p-4">
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask me about jobs, resumes, cover letters, or LinkedIn posts..."
                  className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-full transition-colors font-medium"
                >
                  {isLoading ? '...' : 'Send'}
                </button>
              </div>
            </form>
          </div>

          {/* Features Grid */}
          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-3xl mb-3">🔍</div>
              <h3 className="font-semibold mb-2">Job Search</h3>
              <p className="text-sm text-gray-600">
                Search across RemoteOK, The Muse, Adzuna, and LinkedIn for the best opportunities.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="font-semibold mb-2">Resume Scoring</h3>
              <p className="text-sm text-gray-600">
                AI-powered analysis of how well your resume matches job requirements.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-3xl mb-3">✍️</div>
              <h3 className="font-semibold mb-2">Cover Letters</h3>
              <p className="text-sm text-gray-600">
                Generate personalized, professional cover letters tailored to specific jobs.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-3xl mb-3">📱</div>
              <h3 className="font-semibold mb-2">LinkedIn Posts</h3>
              <p className="text-sm text-gray-600">
                Create engaging professional content to boost your personal brand.
              </p>
            </div>
          </div>

          {/* Technical Details */}
          <div className="mt-12 bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">🔧 Technical Implementation</h3>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-semibold mb-2">AI & APIs</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Claude AI for intelligent tool routing</li>
                  <li>• Real job board API integrations</li>
                  <li>• LinkedIn job scraping</li>
                  <li>• Advanced resume analysis</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Technology Stack</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• React & Gatsby frontend</li>
                  <li>• Node.js API backend</li>
                  <li>• Anthropic Claude integration</li>
                  <li>• Real-time chat interface</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default CareerCopilotPage
