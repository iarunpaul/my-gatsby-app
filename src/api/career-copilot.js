// Gatsby API Route for Career Copilot
// This file should be in src/api/career-copilot.js

const handler = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }
  console.log('Handling job search request', req.body)

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { message, conversationHistory = [] } = req.body
    const startTime = Date.now()

    // Simple mock response for testing
    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(200).json({
        response: `🤖 **Demo Mode Active**\n\nYou asked: "${message}"\n\n**Available Features:**\n- 🔍 Job Search: "Find software engineer jobs"\n- 📊 Resume Scoring: "Score my resume"\n- ✍️ Cover Letters: "Write a cover letter"\n- 📱 LinkedIn Posts: "Create a LinkedIn post"\n\n**To enable full AI features:**\nAdd your Anthropic API key to environment variables.\n\n*This is a demo response since no API key is configured.*`,
        toolUsed: 'demo_mode',
        executionTime: Date.now() - startTime
      })
    }

    // Import Anthropic only if API key is available
    const Anthropic = require('@anthropic-ai/sdk').default
    const axios = require('axios')

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })

    // Simple routing based on keywords
    const messageText = message.toLowerCase()
    
    if (messageText.includes('job') || messageText.includes('find') || messageText.includes('search')) {
      // Job search functionality
      const jobResponse = await handleJobSearch(message, axios)
      return res.status(200).json({
        response: jobResponse,
        toolUsed: 'fetch_jobs',
        executionTime: Date.now() - startTime
      })
    }
    
    if (messageText.includes('cover letter') || messageText.includes('letter')) {
      // Cover letter functionality
      const letterResponse = await handleCoverLetter(message, anthropic)
      return res.status(200).json({
        response: letterResponse,
        toolUsed: 'draft_cover_letter',
        executionTime: Date.now() - startTime
      })
    }
    
    if (messageText.includes('linkedin') || messageText.includes('post')) {
      // LinkedIn post functionality
      const postResponse = await handleLinkedInPost(message, anthropic)
      return res.status(200).json({
        response: postResponse,
        toolUsed: 'draft_linkedin_post',
        executionTime: Date.now() - startTime
      })
    }
    
    if (messageText.includes('score') || messageText.includes('resume')) {
      // Resume scoring functionality
      return res.status(200).json({
        response: `📊 **Resume Scoring**\n\nTo score your resume against jobs, I need:\n1. Your resume content\n2. Job descriptions to compare against\n\nTry: "Find jobs first, then I'll score them against your resume!"`,
        toolUsed: 'score_jobs_prompt',
        executionTime: Date.now() - startTime
      })
    }

    // General AI response
    const generalResponse = await handleGeneralQuery(message, anthropic)
    return res.status(200).json({
      response: generalResponse,
      toolUsed: 'general_chat',
      executionTime: Date.now() - startTime
    })

  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
      response: `❌ **Error occurred**\n\nSorry, I encountered an error: ${error.message}\n\nPlease try again or contact support if the issue persists.`
    })
  }
}

// Job search handler
async function handleJobSearch(message, axios) {
  try {
    // Extract keywords from message
    const keywords = extractKeywords(message)
    
    // Try to fetch from RemoteOK (free API)
    const response = await axios.get('https://remoteok.io/api', {
      timeout: 5000,
      headers: { 'User-Agent': 'AI-Career-Copilot/1.0' }
    })

    if (response.data && Array.isArray(response.data)) {
      const jobs = response.data
        .filter(job => job && job.position && job.company)
        .filter(job => {
          const searchText = `${job.position} ${job.description || ''}`.toLowerCase()
          return keywords.some(keyword => searchText.includes(keyword.toLowerCase()))
        })
        .slice(0, 5)
        .map((job, index) => 
          `${index + 1}. **${job.position}** at ${job.company}\n   📍 ${job.location || 'Remote'}\n   🔗 ${job.url || 'https://remoteok.io'}\n   📝 ${(job.description || 'No description').substring(0, 100)}...`
        )

      if (jobs.length > 0) {
        return `## 🔍 Found ${jobs.length} Jobs\n\n${jobs.join('\n\n')}\n\n**Source:** RemoteOK\n\nWould you like me to help you with cover letters for any of these positions?`
      }
    }

    return `🔍 **Job Search Results**\n\nI searched for "${keywords.join(', ')}" but couldn't find matching jobs right now. This might be due to:\n\n- API rate limits\n- Network issues\n- Very specific search terms\n\nTry different keywords like "developer", "engineer", "designer", etc.`
    
  } catch (error) {
    return `❌ **Job Search Error**\n\nCouldn't fetch jobs due to: ${error.message}\n\nTry again in a moment or use different search terms.`
  }
}

// Cover letter handler
async function handleCoverLetter(message, anthropic) {
  try {
    const prompt = `Create a professional cover letter based on this request: "${message}"

If specific job details aren't provided, create a general but professional cover letter template.

Keep it concise (250-300 words) and professional.`

    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }]
    })

    const coverLetter = response.content[0].text.trim()
    
    return `## ✍️ Cover Letter\n\n${coverLetter}\n\n---\n**Word count:** ~${coverLetter.split(' ').length} words`
    
  } catch (error) {
    return `❌ **Cover Letter Error**\n\nCouldn't generate cover letter: ${error.message}\n\nPlease provide more details like:\n- Job title\n- Company name\n- Your background`
  }
}

// LinkedIn post handler
async function handleLinkedInPost(message, anthropic) {
  try {
    const prompt = `Create a professional LinkedIn post based on: "${message}"

Make it engaging, professional, and include 2-3 relevant hashtags.
Keep it under 300 characters for better engagement.`

    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 500,
      messages: [{ role: 'user', content: prompt }]
    })

    const post = response.content[0].text.trim()
    
    return `## 📱 LinkedIn Post\n\n${post}\n\n---\n**Character count:** ${post.length}`
    
  } catch (error) {
    return `❌ **LinkedIn Post Error**\n\nCouldn't generate post: ${error.message}\n\nTry describing what you want to share, like:\n- A recent achievement\n- A project you completed\n- Career milestone`
  }
}

// General query handler
async function handleGeneralQuery(message, anthropic) {
  try {
    const prompt = `You are an AI career assistant. Respond helpfully to: "${message}"

Keep responses concise and offer to help with:
- Job searching
- Resume scoring
- Cover letter writing
- LinkedIn post creation

Be encouraging and professional.`

    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 500,
      messages: [{ role: 'user', content: prompt }]
    })

    return response.content[0].text.trim()
    
  } catch (error) {
    return `🤖 **AI Career Assistant**\n\nHi! I can help you with:\n\n🔍 **Job Search** - "Find software engineer jobs"\n📊 **Resume Analysis** - "Score my resume"\n✍️ **Cover Letters** - "Write a cover letter for [job]"\n📱 **LinkedIn Posts** - "Create a post about [topic]"\n\nWhat would you like help with?`
  }
}

// Helper function to extract keywords
function extractKeywords(message) {
  const commonKeywords = [
    'software', 'engineer', 'developer', 'programmer', 'frontend', 'backend', 
    'fullstack', 'react', 'javascript', 'python', 'java', 'designer', 'data',
    'scientist', 'analyst', 'manager', 'product', 'marketing', 'sales'
  ]
  
  const words = message.toLowerCase().split(/\W+/)
  const foundKeywords = words.filter(word => commonKeywords.includes(word))
  
  return foundKeywords.length > 0 ? foundKeywords : ['software', 'developer']
}

export default handler

