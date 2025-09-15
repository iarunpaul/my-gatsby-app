import Anthropic from '@anthropic-ai/sdk'
import axios from 'axios'

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// Career Copilot Tools Implementation
class CareerCopilotTools {
  constructor() {
    this.config = {
      providers: {
        remoteOk: { baseUrl: 'https://remoteok.io/api' },
        theMuseJobs: { baseUrl: 'https://www.themuse.com/api/public/jobs' },
        adzuna: {
          appId: process.env.ADZUNA_APP_ID || '',
          appKey: process.env.ADZUNA_APP_KEY || '',
          baseUrl: 'https://api.adzuna.com/v1/api/jobs',
        }
      }
    }
  }

  async fetchJobs(keywords, location = '', limit = 10) {
    const jobs = []
    
    try {
      // Fetch from RemoteOK
      const remoteOkJobs = await this.fetchRemoteOkJobs(keywords, Math.ceil(limit / 2))
      jobs.push(...remoteOkJobs)

      // Fetch from The Muse
      const museJobs = await this.fetchTheMuseJobs(keywords, location, Math.ceil(limit / 2))
      jobs.push(...museJobs)

      // Fetch from Adzuna if configured
      if (this.config.providers.adzuna.appId && this.config.providers.adzuna.appKey) {
        const adzunaJobs = await this.fetchAdzunaJobs(keywords, location, Math.ceil(limit / 3))
        jobs.push(...adzunaJobs)
      }

      // Remove duplicates and limit results
      const uniqueJobs = jobs.filter((job, index, self) =>
        index === self.findIndex(j => 
          j.title.toLowerCase() === job.title.toLowerCase() && 
          j.company.toLowerCase() === job.company.toLowerCase()
        )
      ).slice(0, limit)

      return {
        success: true,
        jobs: uniqueJobs,
        total: uniqueJobs.length,
        sources: [...new Set(uniqueJobs.map(job => job.source))]
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        jobs: []
      }
    }
  }

  async fetchRemoteOkJobs(keywords, limit = 5) {
    try {
      const response = await axios.get(this.config.providers.remoteOk.baseUrl, {
        timeout: 10000,
        headers: { 'User-Agent': 'AI-Career-Copilot/1.0' }
      })

      if (response.data && Array.isArray(response.data)) {
        return response.data
          .filter(job => job && job.position && job.company)
          .filter(job => {
            const searchText = `${job.position} ${job.description || ''}`.toLowerCase()
            return keywords.toLowerCase().split(' ').some(keyword => 
              searchText.includes(keyword.toLowerCase())
            )
          })
          .slice(0, limit)
          .map(job => ({
            id: `remoteok_${job.id || Math.random()}`,
            title: job.position,
            company: job.company,
            location: job.location || 'Remote',
            description: job.description || 'No description available',
            url: job.url || `https://remoteok.io/remote-jobs/${job.id}`,
            source: 'remoteok',
            salary: job.salary_min && job.salary_max ? `$${job.salary_min} - $${job.salary_max}` : null,
            tags: job.tags || []
          }))
      }
      return []
    } catch (error) {
      console.warn(`RemoteOK API error: ${error.message}`)
      return []
    }
  }

  async fetchTheMuseJobs(keywords, location, limit = 5) {
    try {
      const params = new URLSearchParams({
        category: 'Computer and IT',
        page: '0'
      })
      
      if (location && location.toLowerCase() !== 'remote') {
        params.append('location', location)
      }

      const response = await axios.get(`${this.config.providers.theMuseJobs.baseUrl}?${params}`, {
        timeout: 10000,
        headers: { 'User-Agent': 'AI-Career-Copilot/1.0' }
      })

      if (response.data && response.data.results) {
        return response.data.results
          .filter(job => {
            const searchText = `${job.name} ${job.contents || ''}`.toLowerCase()
            return keywords.toLowerCase().split(' ').some(keyword => 
              searchText.includes(keyword.toLowerCase())
            )
          })
          .slice(0, limit)
          .map(job => ({
            id: `themuse_${job.id}`,
            title: job.name,
            company: job.company?.name || 'Unknown Company',
            location: job.locations?.[0]?.name || 'Not specified',
            description: job.contents || 'No description available',
            url: job.refs?.landing_page || `https://www.themuse.com/jobs/${job.id}`,
            source: 'themuse',
            level: job.levels?.[0]?.name,
            categories: job.categories?.map(c => c.name) || []
          }))
      }
      return []
    } catch (error) {
      console.warn(`The Muse API error: ${error.message}`)
      return []
    }
  }

  async fetchAdzunaJobs(keywords, location, limit = 5) {
    if (!this.config.providers.adzuna.appId || !this.config.providers.adzuna.appKey) {
      return []
    }

    try {
      const country = 'us'
      const url = `${this.config.providers.adzuna.baseUrl}/${country}/search/1`
      
      const params = {
        app_id: this.config.providers.adzuna.appId,
        app_key: this.config.providers.adzuna.appKey,
        results_per_page: limit,
        what: keywords,
        where: location || '',
        content_type: 'application/json'
      }

      const response = await axios.get(url, { 
        params,
        timeout: 10000,
        headers: { 'User-Agent': 'AI-Career-Copilot/1.0' }
      })

      if (response.data && response.data.results) {
        return response.data.results.map(job => ({
          id: `adzuna_${job.id}`,
          title: job.title,
          company: job.company?.display_name || 'Unknown Company',
          location: job.location?.display_name || 'Not specified',
          description: job.description || 'No description available',
          url: job.redirect_url || job.url,
          source: 'adzuna',
          salary: job.salary_min && job.salary_max ? `$${job.salary_min} - $${job.salary_max}` : null,
          created: job.created
        }))
      }
      return []
    } catch (error) {
      console.warn(`Adzuna API error: ${error.message}`)
      return []
    }
  }

  async scoreJobsAgainstResume(resume, jobs) {
    if (!jobs || jobs.length === 0) {
      return {
        success: false,
        error: 'No jobs provided for scoring'
      }
    }

    try {
      // Use Claude AI for advanced scoring
      const prompt = `You are an expert career counselor. Score the compatibility between this resume and the following jobs on a scale of 0-100.

Resume:
${resume.content || resume}

Jobs to score:
${jobs.map((job, i) => `${i + 1}. ${job.title} at ${job.company}\n${job.description}`).join('\n\n')}

For each job, provide a JSON object with:
- jobId: the job ID
- jobTitle: the job title
- company: the company name
- overallScore: compatibility score (0-100)
- skillsMatch: skills match percentage (0-100)
- matchingSkills: array of matching skills/keywords
- explanation: brief explanation of the score
- recommendations: array of 2-3 improvement suggestions

Respond with a JSON array of these objects.`

      const response = await anthropic.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }]
      })

      const claudeResponse = response.content[0].text
      
      try {
        const scores = JSON.parse(claudeResponse)
        return {
          success: true,
          scores: scores,
          serviceUsed: 'claude-ai'
        }
      } catch (parseError) {
        // Fallback to simple scoring
        return this.fallbackJobScoring(resume, jobs)
      }
    } catch (error) {
      console.warn(`Claude API error: ${error.message}`)
      return this.fallbackJobScoring(resume, jobs)
    }
  }

  fallbackJobScoring(resume, jobs) {
    const resumeText = (resume.content || resume).toLowerCase()
    const resumeSkills = resume.skills || []

    const scores = jobs.map(job => {
      const jobText = `${job.title} ${job.description}`.toLowerCase()
      
      const matchingSkills = resumeSkills.filter(skill => 
        jobText.includes(skill.toLowerCase())
      )
      
      const jobKeywords = jobText.split(/\W+/).filter(word => word.length > 3)
      const resumeKeywords = resumeText.split(/\W+/).filter(word => word.length > 3)
      const commonKeywords = jobKeywords.filter(keyword => 
        resumeKeywords.includes(keyword)
      )
      
      const skillsMatch = Math.min(100, (matchingSkills.length / Math.max(resumeSkills.length, 1)) * 100)
      const keywordMatch = Math.min(100, (commonKeywords.length / Math.max(jobKeywords.length, 1)) * 100 * 10)
      const overallScore = Math.min(100, (skillsMatch + keywordMatch) / 2 + Math.random() * 10)
      
      return {
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        overallScore: Math.round(overallScore),
        skillsMatch: Math.round(skillsMatch),
        matchingSkills,
        explanation: `Based on ${matchingSkills.length} matching skills and ${commonKeywords.length} common keywords`,
        recommendations: [
          'Highlight relevant experience in your resume',
          'Consider adding missing skills mentioned in the job description',
          'Tailor your resume to include industry-specific keywords'
        ]
      }
    })

    return {
      success: true,
      scores: scores,
      serviceUsed: 'typescript-fallback'
    }
  }

  async draftCoverLetter(jobTitle, companyName, jobDescription, resume, tone = 'professional') {
    try {
      const prompt = `Write a ${tone} cover letter for the following job application:

Job Title: ${jobTitle}
Company: ${companyName}
Job Description: ${jobDescription}

Applicant's Resume/Background:
${resume}

Requirements:
- Keep it concise (250-400 words)
- Match the ${tone} tone
- Highlight relevant experience from the resume
- Show enthusiasm for the role and company
- Include a strong opening and closing
- Make it personalized and specific

Write only the cover letter content, no additional formatting or explanations.`

      const response = await anthropic.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }]
      })

      const coverLetter = response.content[0].text.trim()
      
      return {
        success: true,
        coverLetter: coverLetter,
        analysis: {
          wordCount: coverLetter.split(' ').length,
          characterCount: coverLetter.length,
          tone: tone
        }
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to generate cover letter: ${error.message}`
      }
    }
  }

  async draftLinkedInPost(content, tone = 'professional', includeHashtags = true, maxLength = 1300) {
    try {
      const prompt = `Create a ${tone} LinkedIn post based on this content: "${content}"

Requirements:
- Maximum ${maxLength} characters
- Use a ${tone} tone
- Make it engaging and professional
- ${includeHashtags ? 'Include 3-5 relevant hashtags at the end' : 'Do not include hashtags'}
- Structure it for maximum engagement (hook, value, call-to-action)
- Make it authentic and personal

Write only the LinkedIn post content, no additional formatting or explanations.`

      const response = await anthropic.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 800,
        messages: [{ role: 'user', content: prompt }]
      })

      const post = response.content[0].text.trim()
      const hashtags = includeHashtags ? (post.match(/#\w+/g) || []) : []
      
      return {
        success: true,
        post: post,
        analysis: {
          characterCount: post.length,
          wordCount: post.split(' ').length,
          hashtagCount: hashtags.length,
          hashtags: hashtags,
          tone: tone
        }
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to generate LinkedIn post: ${error.message}`
      }
    }
  }
}

// AI Router to determine which tool to use
async function routeUserRequest(message, conversationHistory) {
  try {
    const prompt = `You are an AI assistant that routes user requests to the appropriate career tools. 

Available tools:
1. fetch_jobs - Search for jobs (keywords: job search, find jobs, hiring, positions, opportunities, work, employment)
2. score_jobs_against_resume - Score resume compatibility (keywords: score, analyze, match, resume, compatibility, rate, evaluate)
3. draft_cover_letter - Generate cover letters (keywords: cover letter, application letter, write letter, letter for job)
4. draft_linkedin_post - Create LinkedIn posts (keywords: linkedin post, social media, professional post, networking, share, post about)

User message: "${message}"

Recent conversation context:
${conversationHistory.slice(-3).map(msg => `${msg.type}: ${msg.content}`).join('\n')}

Analyze the user's intent and respond with a JSON object containing:
{
  "tool": "tool_name",
  "parameters": {
    // extracted parameters from the user message
    // for fetch_jobs: keywords, location, limit
    // for score_jobs_against_resume: resume, jobs
    // for draft_cover_letter: jobTitle, companyName, jobDescription, resume, tone
    // for draft_linkedin_post: content, tone, includeHashtags
  },
  "confidence": 0.95,
  "reasoning": "explanation of why this tool was chosen"
}

If the user is asking a general question or needs clarification, use:
{
  "tool": "general_response",
  "response": "your helpful response",
  "confidence": 0.9
}

Extract specific parameters from the user message when possible.`

    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }]
    })

    return JSON.parse(response.content[0].text)
  } catch (error) {
    console.error('Routing error:', error)
    return {
      tool: 'general_response',
      response: 'I apologize, but I had trouble understanding your request. Could you please rephrase it? I can help you with job searches, resume scoring, cover letter writing, or LinkedIn post creation.',
      confidence: 0.5
    }
  }
}

// Extract parameters from conversation history
function extractJobsFromHistory(conversationHistory) {
  // Look for previous job search results in conversation
  for (let i = conversationHistory.length - 1; i >= 0; i--) {
    const message = conversationHistory[i]
    if (message.type === 'assistant' && message.data && message.data.jobs) {
      return message.data.jobs
    }
  }
  return null
}

function extractResumeFromMessage(message) {
  // Simple extraction - look for resume-like content
  const resumeKeywords = ['experience', 'education', 'skills', 'work history', 'background']
  const hasResumeKeywords = resumeKeywords.some(keyword => 
    message.toLowerCase().includes(keyword)
  )
  
  if (hasResumeKeywords && message.length > 100) {
    return message
  }
  
  return null
}

// Main API handler
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { message, conversationHistory = [] } = req.body
    const startTime = Date.now()

    // Check if Anthropic API key is available
    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(500).json({
        error: 'Anthropic API key not configured',
        message: 'Please set ANTHROPIC_API_KEY environment variable'
      })
    }

    // Route the user request
    const routing = await routeUserRequest(message, conversationHistory)
    
    if (routing.tool === 'general_response') {
      return res.json({
        response: routing.response,
        toolUsed: 'general_chat',
        executionTime: Date.now() - startTime
      })
    }

    const tools = new CareerCopilotTools()
    let result

    // Execute the appropriate tool
    switch (routing.tool) {
      case 'fetch_jobs':
        const { keywords, location, limit } = routing.parameters
        result = await tools.fetchJobs(keywords || message, location, limit || 10)
        
        if (result.success && result.jobs.length > 0) {
          const jobsList = result.jobs.map((job, index) => 
            `${index + 1}. **${job.title}** at ${job.company}\n   📍 ${job.location}\n   🔗 ${job.url}\n   📝 ${job.description.substring(0, 100)}...`
          ).join('\n\n')
          
          return res.json({
            response: `## 🔍 Found ${result.total} Jobs\n\n${jobsList}\n\n**Sources:** ${result.sources.join(', ')}\n\nWould you like me to score any of these jobs against your resume?`,
            toolUsed: 'fetch_jobs',
            executionTime: Date.now() - startTime,
            data: result
          })
        } else {
          return res.json({
            response: `❌ I couldn't find any jobs matching "${keywords || message}". This might be due to:\n\n- API rate limits\n- Network issues\n- Very specific search terms\n\nTry a broader search or different keywords.`,
            toolUsed: 'fetch_jobs',
            executionTime: Date.now() - startTime
          })
        }

      case 'score_jobs_against_resume':
        // Extract resume and jobs from message or conversation history
        const resumeContent = extractResumeFromMessage(message) || routing.parameters.resume
        const jobsToScore = routing.parameters.jobs || extractJobsFromHistory(conversationHistory)
        
        if (!resumeContent) {
          return res.json({
            response: `📊 To score jobs against your resume, I need your resume content. Please paste your resume text or provide your background information.`,
            toolUsed: 'score_jobs_prompt',
            executionTime: Date.now() - startTime
          })
        }
        
        if (!jobsToScore || jobsToScore.length === 0) {
          return res.json({
            response: `📊 I need job listings to score against your resume. You can either:\n\n1. First search for jobs using "Find [job type] jobs"\n2. Provide specific job descriptions you want me to analyze\n\nWould you like me to search for jobs first?`,
            toolUsed: 'score_jobs_prompt',
            executionTime: Date.now() - startTime
          })
        }

        result = await tools.scoreJobsAgainstResume(resumeContent, jobsToScore)
        
        if (result.success) {
          const scoresList = result.scores.map((score, index) => 
            `${index + 1}. **${score.jobTitle}** at ${score.company}\n   📊 Overall Score: ${score.overallScore}%\n   🎯 Skills Match: ${score.skillsMatch}%\n   ✅ Matching Skills: ${score.matchingSkills.join(', ')}\n   💡 ${score.explanation}`
          ).join('\n\n')
          
          return res.json({
            response: `## 📊 Resume Compatibility Scores\n\n${scoresList}\n\n**Analysis powered by:** ${result.serviceUsed}`,
            toolUsed: 'score_jobs_against_resume',
            executionTime: Date.now() - startTime,
            data: result
          })
        } else {
          return res.json({
            response: `❌ Failed to score jobs: ${result.error}`,
            toolUsed: 'score_jobs_against_resume',
            executionTime: Date.now() - startTime
          })
        }

      case 'draft_cover_letter':
        const { jobTitle, companyName, jobDescription, resume, tone } = routing.parameters
        
        if (!jobTitle || !companyName) {
          return res.json({
            response: `✍️ To write a cover letter, I need:\n\n- **Job title**\n- **Company name**\n- **Job description** (optional but recommended)\n- **Your resume/background** (optional but recommended)\n\nExample: "Write a cover letter for Software Engineer at Google"\n\nPlease provide these details and I'll create a personalized cover letter for you!`,
            toolUsed: 'cover_letter_prompt',
            executionTime: Date.now() - startTime
          })
        }

        result = await tools.draftCoverLetter(
          jobTitle, 
          companyName, 
          jobDescription || 'No specific job description provided', 
          resume || 'Please provide your background for a more personalized letter',
          tone || 'professional'
        )
        
        if (result.success) {
          return res.json({
            response: `## ✍️ Cover Letter for ${jobTitle} at ${companyName}\n\n${result.coverLetter}\n\n---\n**Analysis:** ${result.analysis.wordCount} words, ${result.analysis.characterCount} characters`,
            toolUsed: 'draft_cover_letter',
            executionTime: Date.now() - startTime,
            data: result
          })
        } else {
          return res.json({
            response: `❌ Failed to generate cover letter: ${result.error}`,
            toolUsed: 'draft_cover_letter',
            executionTime: Date.now() - startTime
          })
        }

      case 'draft_linkedin_post':
        const { content, tone: postTone, includeHashtags } = routing.parameters
        
        result = await tools.draftLinkedInPost(
          content || message, 
          postTone || 'professional', 
          includeHashtags !== false
        )
        
        if (result.success) {
          return res.json({
            response: `## 📱 LinkedIn Post\n\n${result.post}\n\n---\n**Analysis:** ${result.analysis.characterCount} characters, ${result.analysis.hashtagCount} hashtags`,
            toolUsed: 'draft_linkedin_post',
            executionTime: Date.now() - startTime,
            data: result
          })
        } else {
          return res.json({
            response: `❌ Failed to generate LinkedIn post: ${result.error}`,
            toolUsed: 'draft_linkedin_post',
            executionTime: Date.now() - startTime
          })
        }

      default:
        return res.json({
          response: `🤔 I'm not sure how to help with that. I can assist you with:\n\n🔍 **Job Search** - "Find software engineer jobs in NYC"\n📊 **Resume Scoring** - "Score my resume against these jobs"\n✍️ **Cover Letters** - "Write a cover letter for [job] at [company]"\n📱 **LinkedIn Posts** - "Create a post about my new project"\n\nWhat would you like to try?`,
          toolUsed: 'general_help',
          executionTime: Date.now() - startTime
        })
    }

  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    })
  }
}

