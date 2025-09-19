import React, { useState, useRef, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import Layout from '../components/layout'

// Client-side Career Copilot (no API routes needed)
function CareerCopilotPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: `👋 **Welcome to AI Career Copilot!**

I can help you with:

🔍 **Job Search** - Find jobs across multiple platforms
📊 **Resume Scoring** - Analyze resume-job compatibility  
✍️ **Cover Letters** - Generate personalized letters
📱 **LinkedIn Posts** - Create engaging content

**Try these examples:**
• "Find software engineer jobs"
• "Write a cover letter for developer position"
• "Create a LinkedIn post about my coding project"
• "Help me with my job search"

What would you like help with?`
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

  // Client-side job search function
  const searchJobs = async (keywords) => {
    try {
      // Use CORS proxy for RemoteOK API
      const proxyUrl = 'https://api.allorigins.win/raw?url='
      const targetUrl = 'https://remoteok.io/api'
      
      const response = await fetch(proxyUrl + encodeURIComponent(targetUrl), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch jobs')
      }

      const jobs = await response.json()
      
      if (Array.isArray(jobs)) {
        const filteredJobs = jobs
          .filter(job => job && job.position && job.company)
          .filter(job => {
            const searchText = `${job.position} ${job.description || ''}`.toLowerCase()
            return keywords.toLowerCase().split(' ').some(keyword => 
              searchText.includes(keyword.toLowerCase())
            )
          })
          .slice(0, 5)
          .map((job, index) => 
            `${index + 1}. **${job.position}** at ${job.company}\n   📍 ${job.location || 'Remote'}\n   🔗 ${job.url || 'https://remoteok.io'}\n   📝 ${(job.description || 'No description').substring(0, 100)}...`
          )

        if (filteredJobs.length > 0) {
          return `## 🔍 Found ${filteredJobs.length} Jobs\n\n${filteredJobs.join('\n\n')}\n\n**Source:** RemoteOK\n\nWould you like me to help you with cover letters for any of these positions?`
        }
      }

      return `🔍 **Job Search Results**\n\nI searched for "${keywords}" but couldn't find matching jobs right now. This might be due to:\n\n- API rate limits\n- Network issues\n- Very specific search terms\n\nTry different keywords like "developer", "engineer", "designer", etc.`
      
    } catch (error) {
      return `❌ **Job Search Error**\n\nCouldn't fetch jobs due to network issues. Here's what I would typically find:\n\n**Sample Results for "${keywords}":**\n\n1. **Senior Software Engineer** at TechCorp\n   📍 Remote\n   💰 $120k - $150k\n   📝 Full-stack development with React and Node.js...\n\n2. **Frontend Developer** at StartupXYZ  \n   📍 San Francisco, CA\n   💰 $100k - $130k\n   📝 Building modern web applications with React...\n\n3. **Backend Engineer** at DataCo\n   📍 Remote\n   💰 $110k - $140k\n   📝 Python/Django development for data platforms...\n\n*Note: These are sample results. Real job search requires API access.*`
    }
  }

  // Client-side AI simulation
  const generateAIResponse = async (message, type) => {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))

    const messageText = message.toLowerCase()

    switch (type) {
      case 'cover_letter':
        return `## ✍️ Cover Letter\n\n**Dear Hiring Manager,**\n\nI am writing to express my strong interest in the software engineering position at your company. With my background in full-stack development and passion for creating innovative solutions, I am excited about the opportunity to contribute to your team.\n\nIn my previous roles, I have successfully:\n• Developed scalable web applications using modern frameworks\n• Collaborated with cross-functional teams to deliver high-quality products\n• Implemented best practices for code quality and performance optimization\n\nI am particularly drawn to your company's mission and would welcome the opportunity to discuss how my skills and enthusiasm can contribute to your continued success.\n\nThank you for your consideration. I look forward to hearing from you.\n\n**Sincerely,**\n[Your Name]\n\n---\n**Word count:** ~150 words\n*This is a template - customize with specific details for best results.*`

      case 'linkedin_post':
        return `## 📱 LinkedIn Post\n\n🚀 Excited to share my latest project! Just completed building an AI-powered career assistant that helps job seekers with:\n\n✅ Intelligent job matching\n✅ Resume optimization\n✅ Cover letter generation\n✅ Professional networking content\n\nThe combination of modern web technologies and AI is opening up incredible possibilities for career development. It's amazing how technology can help people find their dream jobs more efficiently!\n\nWhat tools do you use to enhance your job search? Would love to hear your thoughts! 💭\n\n#CareerDevelopment #AI #JobSearch #TechInnovation #WebDevelopment\n\n---\n**Character count:** 487\n*Perfect length for LinkedIn engagement!*`

      case 'resume_score':
        return `## 📊 Resume Analysis\n\n**Overall Compatibility Score: 85%**\n\n**Strengths:**\n✅ Strong technical skills match (90%)\n✅ Relevant experience highlighted (80%)\n✅ Good keyword optimization (85%)\n\n**Areas for Improvement:**\n🔸 Add more quantified achievements\n🔸 Include specific technologies mentioned in job description\n🔸 Highlight leadership/collaboration experience\n\n**Recommendations:**\n1. **Quantify your impact** - Add metrics like "Improved performance by 40%"\n2. **Tailor keywords** - Include specific technologies from job posting\n3. **Showcase soft skills** - Mention teamwork and communication abilities\n\n**Next Steps:**\nUpdate your resume with these suggestions and you'll likely increase your match score to 90%+!\n\n*This is a sample analysis. Upload your actual resume for personalized feedback.*`

      default:
        if (messageText.includes('job') || messageText.includes('find') || messageText.includes('search')) {
          return await searchJobs(message)
        }
        
        return `🤖 **AI Career Assistant**\n\nI understand you're asking about: "${message}"\n\nI can help you with:\n\n🔍 **Job Search** - "Find software engineer jobs"\n📊 **Resume Analysis** - "Score my resume"\n✍️ **Cover Letters** - "Write a cover letter for [job]"\n📱 **LinkedIn Posts** - "Create a post about [topic]"\n\n**Pro Tips:**\n• Be specific about job titles and locations\n• Mention the company name for cover letters\n• Describe your achievement for LinkedIn posts\n• Include your background for resume scoring\n\nWhat would you like to try first?`
    }
  }

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
      const messageText = userMessage.content.toLowerCase()
      let responseType = 'general'
      
      if (messageText.includes('cover letter') || messageText.includes('letter')) {
        responseType = 'cover_letter'
      } else if (messageText.includes('linkedin') || messageText.includes('post')) {
        responseType = 'linkedin_post'
      } else if (messageText.includes('score') || messageText.includes('resume') || messageText.includes('analyze')) {
        responseType = 'resume_score'
      } else if (messageText.includes('job') || messageText.includes('find') || messageText.includes('search')) {
        responseType = 'job_search'
      }

      const response = await generateAIResponse(userMessage.content, responseType)

      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: response,
        toolUsed: responseType
      }

      setMessages(prev => [...prev, assistantMessage])

    } catch (error) {
      console.error('Error:', error)
      
      const errorResponse = {
        id: Date.now() + 1,
        type: 'assistant',
        content: `❌ **Oops!**\n\nSomething went wrong, but I'm still here to help!\n\nTry asking me about:\n• Finding jobs\n• Writing cover letters\n• Creating LinkedIn posts\n• Resume tips\n\nWhat would you like help with?`
      }
      
      setMessages(prev => [...prev, errorResponse])
    } finally {
      setIsLoading(false)
    }
  }

  const formatMessage = (content) => {
    if (typeof content !== 'string') return content

    return content.split('\n').map((line, index) => {
      // Handle headers
      if (line.startsWith('## ')) {
        return <h3 key={index} className="text-lg font-semibold mt-4 mb-2 text-blue-600">{line.replace('## ', '')}</h3>
      }
      if (line.startsWith('# ')) {
        return <h2 key={index} className="text-xl font-bold mt-4 mb-2 text-blue-700">{line.replace('# ', '')}</h2>
      }
      
      // Handle bold text
      if (line.includes('**')) {
        const parts = line.split('**')
        return (
          <p key={index} className="mb-2">
            {parts.map((part, i) => 
              i % 2 === 1 ? <strong key={i}>{part}</strong> : part
            )}
          </p>
        )
      }
      
      // Handle list items
      if (line.startsWith('- ') || line.startsWith('• ') || line.startsWith('✅ ') || line.startsWith('🔸 ')) {
        return <li key={index} className="ml-4 mb-1 list-none">{line}</li>
      }
      
      // Handle numbered lists
      if (/^\d+\./.test(line)) {
        return <li key={index} className="ml-4 mb-1 list-none">{line}</li>
      }
      
      // Handle empty lines
      if (line.trim() === '') {
        return <br key={index} />
      }
      
      // Handle links
      if (line.includes('🔗 ')) {
        const urlMatch = line.match(/(https?:\/\/[^\s]+)/)
        if (urlMatch) {
          const url = urlMatch[1]
          return (
            <p key={index} className="mb-2">
              {line.replace(url, '')}
              <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {url}
              </a>
            </p>
          )
        }
      }
      
      // Regular paragraphs
      return <p key={index} className="mb-2">{line}</p>
    })
  }

  const examplePrompts = [
    "Find remote software engineer jobs",
    "Write a cover letter for a React developer position",
    "Create a LinkedIn post about completing a project",
    "Score my resume against job requirements"
  ]

  const handleExampleClick = (prompt) => {
    setInputValue(prompt)
  }

  return (
    <Layout>
      <Helmet>
        <title>AI Career Copilot Demo | Your Personal Career Assistant</title>
        <meta name="description" content="Try our AI Career Copilot - get job recommendations, resume scoring, cover letter generation, and LinkedIn content creation." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              🤖 AI Career Copilot Demo
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience AI-driven career assistance through natural conversation. 
              Get job recommendations, resume analysis, cover letters, and LinkedIn content.
            </p>
          </div>

          {/* Status Indicator */}
          <div className="mb-4 text-center">
            <div className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
              <span className="text-sm text-gray-600">
                AI Assistant Ready (Client-Side Demo)
              </span>
            </div>
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
                  <p className="text-sm opacity-90">Client-Side Demo - No Server Required</p>
                </div>
                <div className="ml-auto">
                  <div className="flex items-center space-x-2 text-sm">
                    <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-400' : 'bg-green-400'}`}></div>
                    <span>{isLoading ? 'Thinking...' : 'Ready'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="h-96 overflow-y-auto p-4 space-y-4 chat-scroll">
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
                      {formatMessage(message.content)}
                    </div>
                    {message.toolUsed && (
                      <div className="mt-2 text-xs opacity-70 border-t pt-2">
                        🔧 Tool: {message.toolUsed}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 max-w-xs lg:max-w-md px-4 py-3 rounded-2xl">
                    <div className="flex items-center space-x-2">
                      <div className="spinner"></div>
                      <span className="text-sm">AI is processing your request...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Example Prompts */}
            {messages.length <= 1 && (
              <div className="px-4 pb-4 border-t bg-gray-50">
                <p className="text-sm text-gray-600 mb-3 pt-3">💡 Try these examples:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {examplePrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => handleExampleClick(prompt)}
                      className="text-left text-xs bg-white hover:bg-blue-50 text-gray-700 px-3 py-2 rounded-lg transition-colors border border-gray-200 hover:border-blue-300"
                      disabled={isLoading}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="border-t p-4 bg-white">
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask me about jobs, resumes, cover letters, or LinkedIn posts..."
                  className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  disabled={isLoading}
                  maxLength={500}
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-full transition-colors font-medium min-w-[80px]"
                >
                  {isLoading ? (
                    <div className="spinner mx-auto"></div>
                  ) : (
                    'Send'
                  )}
                </button>
              </div>
              <div className="mt-2 text-xs text-gray-500 text-center">
                {inputValue.length}/500 characters
              </div>
            </form>
          </div>

          {/* Features Grid */}
          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-3">🔍</div>
              <h3 className="font-semibold mb-2">Job Search</h3>
              <p className="text-sm text-gray-600">
                Search across multiple job boards for the best opportunities.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="font-semibold mb-2">Resume Analysis</h3>
              <p className="text-sm text-gray-600">
                AI-powered analysis of resume-job compatibility.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-3">✍️</div>
              <h3 className="font-semibold mb-2">Cover Letters</h3>
              <p className="text-sm text-gray-600">
                Generate personalized, professional cover letters.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-3">📱</div>
              <h3 className="font-semibold mb-2">LinkedIn Posts</h3>
              <p className="text-sm text-gray-600">
                Create engaging professional content for networking.
              </p>
            </div>
          </div>

          {/* Demo Notice */}
          <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="text-green-600 text-xl">✅</div>
              <div>
                <h4 className="font-semibold text-green-800 mb-1">Client-Side Demo Active</h4>
                <p className="text-sm text-green-700">
                  This demo runs entirely in your browser - no server required! 
                  It includes simulated AI responses and real job search capabilities. 
                  Perfect for testing and demonstration purposes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default CareerCopilotPage

