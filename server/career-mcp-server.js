const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Mock LinkedIn API Functions (since we don't have Python dependencies)
const mockLinkedInAPI = {
  async searchJobs(keywords, location = '') {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      keywords,
      location,
      jobs: [
        {
          title: "Senior Software Engineer",
          company: "TechCorp Inc",
          location: location || "Remote",
          posted_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          job_id: "job_001",
          url: "https://linkedin.com/jobs/job_001",
          description: `Looking for an experienced ${keywords} professional...`
        },
        {
          title: `${keywords} Specialist`,
          company: "Innovation Labs",
          location: location || "San Francisco, CA",
          posted_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          job_id: "job_002",
          url: "https://linkedin.com/jobs/job_002",
          description: `Join our team as a ${keywords} expert working on cutting-edge projects...`
        },
        {
          title: `Lead ${keywords} Developer`,
          company: "StartupXYZ",
          location: location || "New York, NY",
          posted_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          job_id: "job_003",
          url: "https://linkedin.com/jobs/job_003",
          description: `We're seeking a talented ${keywords} developer to lead our engineering team...`
        }
      ],
      total_jobs: 3,
      data_source: "linkedin_mock_api",
      timestamp: new Date().toISOString()
    };
  },

  async getProfile(username) {
    await new Promise(resolve => setTimeout(resolve, 300));

    return {
      username,
      name: "Professional Developer",
      headline: "Software Engineer & Technology Leader",
      location: "Global",
      industry: "Technology",
      connections: 500,
      data_source: "linkedin_mock_api",
      timestamp: new Date().toISOString()
    };
  },

  async getFeed(username) {
    await new Promise(resolve => setTimeout(resolve, 400));

    return {
      username,
      posts: [
        {
          id: "post_1",
          text: "Excited to share insights on modern software architecture and cloud-native development patterns. The industry is rapidly evolving...",
          published_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          engagement: { likes: 45, comments: 8, shares: 12 }
        },
        {
          id: "post_2",
          text: "Just completed an interesting project involving microservices and container orchestration. Key learnings...",
          published_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          engagement: { likes: 32, comments: 5, shares: 7 }
        }
      ],
      total_posts: 2,
      data_source: "linkedin_mock_api",
      timestamp: new Date().toISOString()
    };
  }
};

// Anthropic API Integration
async function callAnthropicAPI(prompt, apiKey, maxTokens = 1000) {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: maxTokens,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error('Anthropic API call failed:', error);
    throw error;
  }
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    server: 'career_mcp_server',
    timestamp: new Date().toISOString(),
    features: ['job_search', 'profile_analysis', 'ai_summaries', 'cover_letters']
  });
});

// Original Anthropic proxy endpoint (for backward compatibility)
app.post('/api/anthropic', async (req, res) => {
  const { prompt, max_tokens = 1000, apiKey } = req.body;
  if (!apiKey) return res.status(400).json({ error: 'Missing API key' });

  try {
    const response = await callAnthropicAPI(prompt, apiKey, max_tokens);
    res.json({ content: [{ text: response }] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Enhanced Career Copilot Endpoints

// Job Search with LinkedIn integration
app.get('/api/linkedin/jobs', async (req, res) => {
  try {
    const { keywords = 'software engineer', location = '' } = req.query;
    console.log(`🔍 Searching jobs: ${keywords} in ${location}`);

    const jobResults = await mockLinkedInAPI.searchJobs(keywords, location);

    // Format for frontend consumption
    const formattedJobs = jobResults.jobs.map((job, index) =>
      `${index + 1}. **${job.title}** at ${job.company}\n   📍 ${job.location}\n   🔗 ${job.url}\n   📝 ${job.description.substring(0, 100)}...`
    );

    const response = {
      success: true,
      response: `## 🔍 Found ${jobResults.total_jobs} LinkedIn Jobs\n\n${formattedJobs.join('\n\n')}\n\n**Source:** LinkedIn API\n\nWould you like me to help you with cover letters for any of these positions?`,
      jobs: jobResults.jobs,
      total_jobs: jobResults.total_jobs,
      data_source: jobResults.data_source
    };

    res.json(response);
  } catch (error) {
    console.error('Job search error:', error);
    res.status(500).json({ error: error.message });
  }
});

// LinkedIn Profile
app.get('/api/linkedin/profile/:username', async (req, res) => {
  try {
    const { username } = req.params;
    console.log(`👤 Fetching profile: ${username}`);

    const profile = await mockLinkedInAPI.getProfile(username);
    res.json(profile);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: error.message });
  }
});

// LinkedIn Feed
app.get('/api/linkedin/feed/:username', async (req, res) => {
  try {
    const { username } = req.params;
    console.log(`📰 Fetching feed: ${username}`);

    const feed = await mockLinkedInAPI.getFeed(username);
    res.json(feed);
  } catch (error) {
    console.error('Feed fetch error:', error);
    res.status(500).json({ error: error.message });
  }
});

// AI-Powered Career Tools
app.post('/api/career/cover-letter', async (req, res) => {
  try {
    const { jobTitle, companyName, userBackground, apiKey } = req.body;

    if (!apiKey) {
      return res.status(400).json({ error: 'Missing API key' });
    }

    const prompt = `Write a professional cover letter for a ${jobTitle} position at ${companyName}.

User Background: ${userBackground || 'Experienced software professional'}

Requirements:
- Keep it concise (250-400 words)
- Professional tone
- Highlight relevant experience
- Show enthusiasm for the role and company
- Include a strong opening and closing
- Make it personalized and specific

Write only the cover letter content, no additional formatting or explanations.`;

    const coverLetter = await callAnthropicAPI(prompt, apiKey, 1500);

    res.json({
      response: `## ✍️ AI-Generated Cover Letter\n\n${coverLetter}\n\n---\n**Word count:** ~${coverLetter.split(' ').length} words\n*Generated by Claude AI*`,
      coverLetter,
      toolUsed: 'ai_cover_letter'
    });
  } catch (error) {
    console.error('Cover letter generation error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/career/linkedin-post', async (req, res) => {
  try {
    const { topic, tone = 'professional', apiKey } = req.body;

    if (!apiKey) {
      return res.status(400).json({ error: 'Missing API key' });
    }

    const prompt = `Create a professional LinkedIn post about: "${topic}"

Requirements:
- Make it engaging and ${tone}
- Include 3-5 relevant hashtags at the end
- Structure it for maximum engagement (hook, value, call-to-action)
- Keep it under 1300 characters for better engagement
- Make it authentic and personal
- Use emojis appropriately

Write only the LinkedIn post content, no additional formatting or explanations.`;

    const post = await callAnthropicAPI(prompt, apiKey, 800);

    res.json({
      response: `## 📱 AI-Generated LinkedIn Post\n\n${post}\n\n---\n**Character count:** ${post.length}\n*Generated by Claude AI*`,
      post,
      toolUsed: 'ai_linkedin_post'
    });
  } catch (error) {
    console.error('LinkedIn post generation error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/career/resume-analysis', async (req, res) => {
  try {
    const { resumeContent, jobDescription, apiKey } = req.body;

    if (!apiKey) {
      return res.status(400).json({ error: 'Missing API key' });
    }

    const prompt = `Analyze this resume against the job requirements and provide scoring:

Resume Content: ${resumeContent}
Job Description: ${jobDescription || 'General software engineering position'}

Provide a comprehensive resume analysis including:
- Overall compatibility score (0-100%)
- Strengths and areas for improvement
- Specific recommendations for enhancement
- Skills match analysis
- Keyword optimization suggestions

Format the response with clear sections and actionable advice.`;

    const analysis = await callAnthropicAPI(prompt, apiKey, 1500);

    res.json({
      response: `## 📊 AI-Powered Resume Analysis\n\n${analysis}\n\n---\n*Analysis by Claude AI*`,
      analysis,
      toolUsed: 'ai_resume_analysis'
    });
  } catch (error) {
    console.error('Resume analysis error:', error);
    res.status(500).json({ error: error.message });
  }
});

// LinkedIn Summary Generation
app.post('/api/linkedin/summary', async (req, res) => {
  try {
    const { username, apiKey } = req.body;

    if (!apiKey) {
      return res.status(400).json({ error: 'Missing API key' });
    }

    console.log(`🤖 Generating AI summary for: ${username}`);

    // Get LinkedIn data
    const [profile, feed] = await Promise.all([
      mockLinkedInAPI.getProfile(username),
      mockLinkedInAPI.getFeed(username)
    ]);

    const prompt = `Analyze this LinkedIn professional's recent activity and create a comprehensive summary:

Profile: ${JSON.stringify(profile, null, 2)}
Recent Posts: ${JSON.stringify(feed.posts, null, 2)}

Please provide:
1. Professional summary of their expertise and focus areas
2. Analysis of recent content themes and engagement
3. Key topics they're discussing
4. Professional insights and thought leadership areas
5. Engagement metrics analysis

Format as a professional summary suitable for a personal website.`;

    const aiSummary = await callAnthropicAPI(prompt, apiKey, 1000);

    res.json({
      username,
      summary: aiSummary,
      engagement_metrics: {
        total_posts: feed.posts.length,
        avg_engagement: feed.posts.reduce((acc, post) =>
          acc + post.engagement.likes + post.engagement.comments + post.engagement.shares, 0) / feed.posts.length,
        top_topics: ["Software Architecture", "Technology Leadership", "Professional Development"]
      },
      data_source: "claude_ai_analysis",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Summary generation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Enhanced Career Chat Endpoint
app.post('/api/career/chat', async (req, res) => {
  try {
    const { message, apiKey } = req.body;
    console.log('Career chat request:', message);

    const messageText = message.toLowerCase();

    // Enhanced routing based on keywords
    if (messageText.includes('job') || messageText.includes('find') || messageText.includes('search')) {
      // Extract keywords for job search
      const keywords = extractJobKeywords(message);
      const location = extractLocation(message);

      const jobResults = await mockLinkedInAPI.searchJobs(keywords, location);

      const formattedJobs = jobResults.jobs.map((job, index) =>
        `${index + 1}. **${job.title}** at ${job.company}\n   📍 ${job.location}\n   🔗 ${job.url}\n   📝 ${job.description.substring(0, 100)}...`
      );

      return res.json({
        response: `## 🔍 Found ${jobResults.total_jobs} LinkedIn Jobs\n\n${formattedJobs.join('\n\n')}\n\n**Source:** LinkedIn Integration\n\nWould you like me to help you with cover letters for any of these positions?`,
        toolUsed: 'linkedin_job_search',
        jobResults
      });
    }

    if (messageText.includes('cover letter') || messageText.includes('letter')) {
      // Extract job details from message
      const jobTitle = extractJobTitle(message) || 'software engineer';
      const companyName = extractCompanyName(message) || '[Company Name]';

      if (!apiKey) {
        return res.json({
          response: `## ✍️ Cover Letter Template\n\nTo generate a personalized cover letter for ${jobTitle} at ${companyName}, please add your Anthropic API key.\n\n**Template Structure:**\n- Strong opening with enthusiasm\n- Relevant experience highlights\n- Company-specific interests\n- Professional closing\n\nOnce you add your API key, I can create a customized letter!`,
          toolUsed: 'cover_letter_template'
        });
      }

      const prompt = `Write a professional cover letter for a ${jobTitle} position at ${companyName}.

Requirements:
- Keep it concise (250-400 words)
- Professional tone
- Highlight relevant software engineering experience
- Show enthusiasm for the role and company
- Include a strong opening and closing

Write only the cover letter content.`;

      const coverLetter = await callAnthropicAPI(prompt, apiKey, 1500);

      return res.json({
        response: `## ✍️ AI-Generated Cover Letter\n\n${coverLetter}\n\n---\n**Word count:** ~${coverLetter.split(' ').length} words\n*Generated by Claude AI*`,
        toolUsed: 'ai_cover_letter'
      });
    }

    if (messageText.includes('linkedin') || messageText.includes('post')) {
      const topic = extractTopic(message) || 'professional development';

      if (!apiKey) {
        return res.json({
          response: `## 📱 LinkedIn Post Template\n\n🚀 Excited to share thoughts on ${topic}!\n\nTemplate structure:\n✅ Hook with compelling opening\n✅ Value-driven content\n✅ Call-to-action for engagement\n✅ Relevant hashtags\n\nAdd your API key for AI-generated posts!`,
          toolUsed: 'linkedin_post_template'
        });
      }

      const prompt = `Create a professional LinkedIn post about: "${topic}"

Requirements:
- Make it engaging and professional
- Include 3-5 relevant hashtags at the end
- Structure for maximum engagement
- Keep under 1300 characters
- Use appropriate emojis

Write only the post content.`;

      const post = await callAnthropicAPI(prompt, apiKey, 800);

      return res.json({
        response: `## 📱 AI-Generated LinkedIn Post\n\n${post}\n\n---\n**Character count:** ${post.length}\n*Generated by Claude AI*`,
        toolUsed: 'ai_linkedin_post'
      });
    }

    if (messageText.includes('score') || messageText.includes('resume') || messageText.includes('analyze')) {
      if (!apiKey) {
        return res.json({
          response: `## 📊 Resume Analysis\n\nTo analyze your resume, I need:\n1. Your resume content\n2. Job descriptions to compare against\n3. Your Anthropic API key for AI analysis\n\nTry: "Here's my resume: [paste content]" after adding your API key!`,
          toolUsed: 'resume_analysis_prompt'
        });
      }

      const prompt = `You are an AI career assistant. Respond helpfully to: "${message}"

Keep responses concise and offer to help with:
- LinkedIn job searching with real API integration
- AI-powered resume analysis
- Cover letter writing
- LinkedIn post creation
- Professional profile summaries

Be encouraging and professional.`;

      const response = await callAnthropicAPI(prompt, apiKey, 800);

      return res.json({
        response: `🤖 **AI Career Assistant**\n\n${response}\n\n---\n*Powered by Claude AI*`,
        toolUsed: 'ai_career_advice'
      });
    }

    // General AI response
    if (apiKey) {
      const prompt = `You are an AI career assistant. Respond helpfully to: "${message}"

Available tools:
- LinkedIn job search integration
- AI cover letter generation
- LinkedIn post creation
- Resume analysis
- Professional summaries

Keep responses concise and professional.`;

      const response = await callAnthropicAPI(prompt, apiKey, 800);

      return res.json({
        response: `🤖 **AI Career Assistant**\n\n${response}\n\n---\n*Powered by Claude AI & LinkedIn Integration*`,
        toolUsed: 'ai_general'
      });
    } else {
      return res.json({
        response: `🤖 **AI Career Assistant**\n\nHi! I can help you with:\n\n🔍 **LinkedIn Job Search** - "Find software engineer jobs"\n📊 **Resume Analysis** - "Score my resume"\n✍️ **Cover Letters** - "Write a cover letter for [job]"\n📱 **LinkedIn Posts** - "Create a post about [topic]"\n\n*Add your Anthropic API key for AI-powered responses!*\n\nWhat would you like help with?`,
        toolUsed: 'general_help'
      });
    }

  } catch (error) {
    console.error('Career chat error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message,
      response: `❌ **Error occurred**\n\nSorry, I encountered an error: ${error.message}\n\nPlease try again or contact support if the issue persists.`
    });
  }
});

// Helper functions for message parsing
function extractJobKeywords(message) {
  const keywords = ['software', 'engineer', 'developer', 'programmer', 'frontend', 'backend', 'fullstack', 'react', 'javascript', 'python', 'java'];
  const words = message.toLowerCase().split(/\W+/);
  const found = words.filter(word => keywords.includes(word));
  return found.length > 0 ? found.join(' ') : 'software engineer';
}

function extractLocation(message) {
  const locationKeywords = ['remote', 'san francisco', 'new york', 'seattle', 'austin', 'boston'];
  const messageLower = message.toLowerCase();
  for (const location of locationKeywords) {
    if (messageLower.includes(location)) {
      return location;
    }
  }
  return '';
}

function extractJobTitle(message) {
  const jobTitles = ['software engineer', 'developer', 'programmer', 'architect', 'manager', 'designer'];
  const messageLower = message.toLowerCase();
  for (const title of jobTitles) {
    if (messageLower.includes(title)) {
      return title;
    }
  }
  return null;
}

function extractCompanyName(message) {
  // Simple regex to find company names after "at" or "for"
  const match = message.match(/(?:at|for)\s+([A-Z][a-zA-Z\s&]+)/);
  return match ? match[1].trim() : null;
}

function extractTopic(message) {
  // Extract topic from LinkedIn post requests
  const match = message.match(/post about (.+)/i);
  return match ? match[1].trim() : null;
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Career MCP Server running on http://localhost:${PORT}`);
  console.log(`Available endpoints:`);
  console.log(`  Health: GET /health`);
  console.log(`  Jobs: GET /api/linkedin/jobs?keywords=...&location=...`);
  console.log(`  Profile: GET /api/linkedin/profile/:username`);
  console.log(`  Feed: GET /api/linkedin/feed/:username`);
  console.log(`  Summary: POST /api/linkedin/summary`);
  console.log(`  Career Chat: POST /api/career/chat`);
  console.log(`  Cover Letter: POST /api/career/cover-letter`);
  console.log(`  LinkedIn Post: POST /api/career/linkedin-post`);
  console.log(`  Resume Analysis: POST /api/career/resume-analysis`);
});