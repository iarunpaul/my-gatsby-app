import React, { useState, useRef, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import Layout from '../components/layout'

// API Configuration - automatically detects production vs development
const API_BASE_URL = process.env.GATSBY_API_BASE_URL ||
  (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:3001'
    : 'https://linkedin-career-server.azurewebsites.net');

// Client-side Career Copilot with Anthropic API
const CareerCopilotPage = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: `🚀 **Welcome to REAL LinkedIn Career Copilot!**

Powered by Live LinkedIn Scraping + Multi-API Integration:

🔍 **REAL LinkedIn Job Search** - Live scraping from actual LinkedIn job pages
📊 **Multi-API Aggregation** - RemoteOK, The Muse, LinkedIn combined
✍️ **AI Cover Letters** - Claude AI-powered personalized letters
📱 **AI LinkedIn Posts** - Engagement-optimized professional content
🤖 **Claude AI Integration** - Advanced analysis and content generation

**LIVE DATA FEATURES:**
• "Find remote data scientist jobs" - Real positions from Notion, Netflix, etc.
• "Find software engineer jobs in NYC" - Live LinkedIn + API results
• "Write a cover letter for [specific job]" - AI-powered generation
• "Create a LinkedIn post about [topic]" - Optimized for engagement

**🔥 REAL LINKEDIN SCRAPING ACTIVE** ✅
**📊 Multi-API job aggregation enabled** ✅
**🤖 Claude AI integration ready** ✅

Real jobs, real data, real results. What would you like to find?`
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [apiKeyConfigured, setApiKeyConfigured] = useState(false)
  const messagesEndRef = useRef(null)

  // Check if Anthropic API key is available
  useEffect(() => {
    // In a real app, you'd check environment variables or user settings
    // For demo, we'll assume it's configured if user has set it
    const hasApiKey = process.env.GATSBY_ANTHROPIC_API_KEY || 
                     localStorage.getItem('anthropic_api_key') ||
                     window.ANTHROPIC_API_KEY
    setApiKeyConfigured(!!hasApiKey)
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Anthropic API client-side call
  const callAnthropicAPI = async (prompt, maxTokens = 1000) => {
    try {
      // Get API key from environment or localStorage
      const apiKey = process.env.GATSBY_ANTHROPIC_API_KEY || 
                    localStorage.getItem('anthropic_api_key') ||
                    window.ANTHROPIC_API_KEY

      if (!apiKey) {
        throw new Error('Anthropic API key not configured')
      }

      //  // Use a CORS proxy for client-side API calls
      // const proxyUrl = 'https://api.allorigins.win/raw?url='
      // const targetUrl = 'https://api.anthropic.com/v1/messages'
     
      // const response = await fetch(proxyUrl + encodeURIComponent(targetUrl), {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'x-api-key': apiKey,
      //   },
      //   body: JSON.stringify({
      //     model: 'claude-3-haiku-20240307',
      //     max_tokens: maxTokens,
      //     messages: [
      //       {
      //         role: 'user',
      //         content: prompt
      //       }
      //     ]
      //   })
      // })
      const response = await fetch(`${API_BASE_URL}/api/anthropic`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, max_tokens: maxTokens, apiKey })
      });

      if (!response.ok) {
        throw new Error(`Anthropic API error: ${response.status}`)
      }

      const data = await response.json()
      return data.content[0].text

    } catch (error) {
      console.warn('Anthropic API call failed:', error.message)
      throw error
    }
  }

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

        if (filteredJobs.length > 0) {
          const jobsList = filteredJobs.map((job, index) => 
            `${index + 1}. **${job.position}** at ${job.company}\n   📍 ${job.location || 'Remote'}\n   🔗 ${job.url || 'https://remoteok.io'}\n   📝 ${(job.description || 'No description').substring(0, 100)}...`
          ).join('\n\n')

          return {
            success: true,
            response: `## 🔍 Found ${filteredJobs.length} Jobs\n\n${jobsList}\n\n**Source:** RemoteOK\n\nWould you like me to help you with cover letters for any of these positions?`,
            jobs: filteredJobs
          }
        }
      }

      return {
        success: false,
        response: `🔍 **Job Search Results**\n\nI searched for "${keywords}" but couldn't find matching jobs right now. This might be due to:\n\n- API rate limits\n- Network issues\n- Very specific search terms\n\nTry different keywords like "developer", "engineer", "designer", etc.`
      }
      
    } catch (error) {
      return {
        success: false,
        response: `❌ **Job Search Error**\n\nCouldn't fetch jobs due to network issues. Here's what I would typically find:\n\n**Sample Results for "${keywords}":**\n\n1. **Senior Software Engineer** at TechCorp\n   📍 Remote\n   💰 $120k - $150k\n   📝 Full-stack development with React and Node.js...\n\n2. **Frontend Developer** at StartupXYZ  \n   📍 San Francisco, CA\n   💰 $100k - $130k\n   📝 Building modern web applications with React...\n\n3. **Backend Engineer** at DataCo\n   📍 Remote\n   💰 $110k - $140k\n   📝 Python/Django development for data platforms...\n\n*Note: These are sample results. Real job search requires API access.*`
      }
    }
  }

  // AI-powered cover letter generation
  const generateCoverLetter = async (message) => {
    if (!apiKeyConfigured) {
      return `## ✍️ Cover Letter Template\n\n**Dear Hiring Manager,**\n\nI am writing to express my strong interest in the software engineering position at your company. With my background in full-stack development and passion for creating innovative solutions, I am excited about the opportunity to contribute to your team.\n\nIn my previous roles, I have successfully:\n• Developed scalable web applications using modern frameworks\n• Collaborated with cross-functional teams to deliver high-quality products\n• Implemented best practices for code quality and performance optimization\n\nI am particularly drawn to your company's mission and would welcome the opportunity to discuss how my skills and enthusiasm can contribute to your continued success.\n\nThank you for your consideration. I look forward to hearing from you.\n\n**Sincerely,**\n[Your Name]\n\n---\n**Word count:** ~150 words\n*This is a template - add your Anthropic API key for personalized letters.*`
    }

    try {
      const prompt = `Write a professional cover letter based on this request: "${message}"

Requirements:
- Keep it concise (250-400 words)
- Professional tone
- Highlight relevant experience
- Show enthusiasm for the role and company
- Include a strong opening and closing
- Make it personalized and specific

If specific job details aren't provided, create a general but professional cover letter template.

Write only the cover letter content, no additional formatting or explanations.`

      const coverLetter = await callAnthropicAPI(prompt, 1500)
      
      return `## ✍️ AI-Generated Cover Letter\n\n${coverLetter}\n\n---\n**Word count:** ~${coverLetter.split(' ').length} words\n*Generated by Claude AI*`
      
    } catch (error) {
      return `❌ **Cover Letter Error**\n\nCouldn't generate cover letter: ${error.message}\n\nPlease provide more details like:\n- Job title\n- Company name\n- Your background\n\nOr check your Anthropic API key configuration.`
    }
  }

  // AI-powered LinkedIn post generation
  const generateLinkedInPost = async (message) => {
    if (!apiKeyConfigured) {
      return `## 📱 LinkedIn Post Template\n\n🚀 Excited to share my latest project! Just completed building an AI-powered career assistant that helps job seekers with:\n\n✅ Intelligent job matching\n✅ Resume optimization\n✅ Cover letter generation\n✅ Professional networking content\n\nThe combination of modern web technologies and AI is opening up incredible possibilities for career development. It's amazing how technology can help people find their dream jobs more efficiently!\n\nWhat tools do you use to enhance your job search? Would love to hear your thoughts! 💭\n\n#CareerDevelopment #AI #JobSearch #TechInnovation #WebDevelopment\n\n---\n**Character count:** 487\n*This is a template - add your Anthropic API key for personalized posts.*`
    }

    try {
      const prompt = `Create a professional LinkedIn post based on: "${message}"

Requirements:
- Make it engaging and professional
- Include 3-5 relevant hashtags at the end
- Structure it for maximum engagement (hook, value, call-to-action)
- Keep it under 1300 characters for better engagement
- Make it authentic and personal
- Use emojis appropriately

Write only the LinkedIn post content, no additional formatting or explanations.`

      const post = await callAnthropicAPI(prompt, 800)
      
      return `## 📱 AI-Generated LinkedIn Post\n\n${post}\n\n---\n**Character count:** ${post.length}\n*Generated by Claude AI*`
      
    } catch (error) {
      return `❌ **LinkedIn Post Error**\n\nCouldn't generate post: ${error.message}\n\nTry describing what you want to share, like:\n- A recent achievement\n- A project you completed\n- Career milestone\n\nOr check your Anthropic API key configuration.`
    }
  }

  // AI-powered resume scoring
  const scoreResume = async (message) => {
    if (!apiKeyConfigured) {
      return `## 📊 Resume Analysis Template\n\n**Overall Compatibility Score: 85%**\n\n**Strengths:**\n✅ Strong technical skills match (90%)\n✅ Relevant experience highlighted (80%)\n✅ Good keyword optimization (85%)\n\n**Areas for Improvement:**\n🔸 Add more quantified achievements\n🔸 Include specific technologies mentioned in job description\n🔸 Highlight leadership/collaboration experience\n\n**Recommendations:**\n1. **Quantify your impact** - Add metrics like "Improved performance by 40%"\n2. **Tailor keywords** - Include specific technologies from job posting\n3. **Showcase soft skills** - Mention teamwork and communication abilities\n\n**Next Steps:**\nUpdate your resume with these suggestions and you'll likely increase your match score to 90%+!\n\n*This is a sample analysis. Add your Anthropic API key for personalized feedback.*`
    }

    try {
      const prompt = `Analyze this resume or career background and provide scoring: "${message}"

Provide a comprehensive resume analysis including:
- Overall compatibility score (0-100%)
- Strengths and areas for improvement
- Specific recommendations for enhancement
- Skills match analysis
- Keyword optimization suggestions

Format the response with clear sections and actionable advice.

If no specific resume content is provided, give general resume improvement advice.`

      const analysis = await callAnthropicAPI(prompt, 1500)
      
      return `## 📊 AI-Powered Resume Analysis\n\n${analysis}\n\n---\n*Analysis by Claude AI*`
      
    } catch (error) {
      return `❌ **Resume Analysis Error**\n\nCouldn't analyze resume: ${error.message}\n\nPlease provide:\n- Your resume content\n- Job descriptions to compare against\n- Specific skills you want to highlight\n\nOr check your Anthropic API key configuration.`
    }
  }

  // General AI assistant
  const generateGeneralResponse = async (message) => {
    if (!apiKeyConfigured) {
      return `🤖 **AI Career Assistant**\n\nI understand you're asking about: "${message}"\n\nI can help you with:\n\n🔍 **Job Search** - "Find software engineer jobs"\n📊 **Resume Analysis** - "Score my resume"\n✍️ **Cover Letters** - "Write a cover letter for [job]"\n📱 **LinkedIn Posts** - "Create a post about [topic]"\n\n**Pro Tips:**\n• Be specific about job titles and locations\n• Mention the company name for cover letters\n• Describe your achievement for LinkedIn posts\n• Include your background for resume scoring\n\n*Add your Anthropic API key for AI-powered responses!*\n\nWhat would you like to try first?`
    }

    try {
      const prompt = `You are an AI career assistant. Respond helpfully to: "${message}"

Keep responses concise and offer to help with:
- Job searching
- Resume scoring
- Cover letter writing
- LinkedIn post creation

Be encouraging, professional, and provide actionable advice.`

      const response = await callAnthropicAPI(prompt, 800)
      
      return `🤖 **AI Career Assistant**\n\n${response}\n\n---\n*Powered by Claude AI*`
      
    } catch (error) {
      return `🤖 **AI Career Assistant**\n\nHi! I can help you with:\n\n🔍 **Job Search** - "Find software engineer jobs"\n📊 **Resume Analysis** - "Score my resume"\n✍️ **Cover Letters** - "Write a cover letter for [job]"\n📱 **LinkedIn Posts** - "Create a post about [topic]"\n\n*Note: Add your Anthropic API key for AI-powered responses.*\n\nWhat would you like help with?`
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
      // Use the enhanced MCP career chat endpoint
      const apiKey = process.env.GATSBY_ANTHROPIC_API_KEY ||
                    localStorage.getItem('anthropic_api_key') ||
                    window.ANTHROPIC_API_KEY

      const response = await fetch(`${API_BASE_URL}/api/career/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          apiKey: apiKey
        })
      });

      if (!response.ok) {
        throw new Error(`MCP Server error: ${response.status}`)
      }

      const data = await response.json()

      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: data.response,
        toolUsed: data.toolUsed || 'mcp_career_chat',
        aiPowered: !!apiKey,
        mcpEnhanced: true
      }

      setMessages(prev => [...prev, assistantMessage])

    } catch (error) {
      console.error('Error:', error)

      const errorResponse = {
        id: Date.now() + 1,
        type: 'assistant',
        content: `❌ **Oops!**\n\nSomething went wrong: ${error.message}\n\nTry asking me about:\n• LinkedIn job search\n• Writing cover letters\n• Creating LinkedIn posts\n• Resume analysis\n• Professional summaries\n\nWhat would you like help with?`
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
    "Find remote data scientist jobs",
    "Find software engineer jobs in NYC",
    "Write a cover letter for Netflix Data Scientist",
    "Create a LinkedIn post about completing an AI project"
  ]

  const handleExampleClick = (prompt) => {
    setInputValue(prompt)
  }

  // API Key configuration component
  const configureApiKey = () => {
    const apiKey = prompt('Enter your Anthropic API key (starts with sk-ant-):')
    if (apiKey && apiKey.startsWith('sk-ant-')) {
      localStorage.setItem('anthropic_api_key', apiKey)
      window.ANTHROPIC_API_KEY = apiKey
      setApiKeyConfigured(true)
      alert('API key configured! You now have access to AI-powered responses.')
    } else if (apiKey) {
      alert('Invalid API key format. Please enter a valid Anthropic API key.')
    }
  }

  return (
    <Layout>
      <Helmet>
        <title>REAL LinkedIn Career Copilot | Live Job Scraping + AI</title>
        <meta name="description" content="Real LinkedIn Career Copilot with live job scraping, multi-API integration, and Claude AI. Find actual jobs from LinkedIn, RemoteOK, The Muse with AI-powered analysis." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              🔥 REAL LinkedIn Career Copilot
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Live LinkedIn job scraping + Multi-API integration + Claude AI.
              Real jobs from actual LinkedIn pages, RemoteOK, The Muse with AI-powered analysis.
            </p>
          </div>

          {/* Status Indicator */}
          <div className="mb-4 text-center">
            <div className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <div className={`w-2 h-2 rounded-full ${apiKeyConfigured ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
              <span className="text-sm text-gray-600">
                {apiKeyConfigured ? 'AI Assistant Ready (Claude AI)' : 'Demo Mode (Templates Only)'}
              </span>
              {!apiKeyConfigured && (
                <button 
                  onClick={configureApiKey}
                  className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                >
                  Add API Key
                </button>
              )}
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
                  <p className="text-sm opacity-90">
                    {apiKeyConfigured ? 'Powered by Claude AI & Real Job APIs' : 'Demo Mode - Add API Key for AI Features'}
                  </p>
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
                        {message.aiPowered && <span className="ml-2">⚡ AI-Powered</span>}
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
                      <span className="text-sm">
                        {apiKeyConfigured ? 'Claude AI is processing...' : 'Generating response...'}
                      </span>
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

          {/* API Key Notice */}
          {!apiKeyConfigured && (
            <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="text-yellow-600 text-xl">🔑</div>
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-1">Unlock AI Features</h4>
                  <p className="text-sm text-yellow-700 mb-3">
                    Add your Anthropic API key to enable Claude AI-powered responses for cover letters, LinkedIn posts, and resume analysis.
                  </p>
                  <button 
                    onClick={configureApiKey}
                    className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 text-sm"
                  >
                    Configure API Key
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Success Notice */}
          {apiKeyConfigured && (
            <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="text-green-600 text-xl">✅</div>
                <div>
                  <h4 className="font-semibold text-green-800 mb-1">AI Features Active</h4>
                  <p className="text-sm text-green-700">
                    Claude AI is now powering your career assistant! You have access to personalized cover letters, 
                    LinkedIn posts, resume analysis, and intelligent career advice.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default CareerCopilotPage

