const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');

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

// MCP Server Interface
class MCPServerInterface {
  constructor() {
    this.mcpProcess = null;
    this.isConnected = false;
    this.pendingRequests = new Map();
    this.requestIdCounter = 0;
  }

  async startMCPServer() {
    try {
      const mcpServerPath = path.join(__dirname, '..', 'mcp-servers', 'linkedin-real', 'enhanced-server-with-linkedin.js');
      console.log('Starting real MCP server:', mcpServerPath);

      this.mcpProcess = spawn('node', [mcpServerPath], {
        stdio: ['pipe', 'pipe', 'pipe'],
        env: {
          ...process.env,
          ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || '',
          ADZUNA_APP_ID: process.env.ADZUNA_APP_ID || '',
          ADZUNA_APP_KEY: process.env.ADZUNA_APP_KEY || '',
          JOOBLE_API_KEY: process.env.JOOBLE_API_KEY || ''
        }
      });

      this.mcpProcess.stdout.on('data', (data) => {
        try {
          const lines = data.toString().split('\n').filter(line => line.trim());

          for (const line of lines) {
            if (line.trim().startsWith('{')) {
              const response = JSON.parse(line);

              if (response.id && this.pendingRequests.has(response.id)) {
                const { resolve } = this.pendingRequests.get(response.id);
                this.pendingRequests.delete(response.id);
                resolve(response);
              }
            }
          }
        } catch (error) {
          console.warn('Error parsing MCP response:', error.message);
        }
      });

      this.mcpProcess.stderr.on('data', (data) => {
        const message = data.toString();
        if (message.includes('INFO:') || message.includes('WARN:') || message.includes('ERROR:')) {
          console.log('MCP Server:', message.trim());
        }

        if (message.includes('AI Career Copilot MCP Server is running')) {
          this.isConnected = true;
          console.log('✅ MCP Server connected successfully');
        }
      });

      this.mcpProcess.on('close', (code) => {
        console.log(`MCP Server process exited with code ${code}`);
        this.isConnected = false;
      });

      this.mcpProcess.on('error', (error) => {
        console.error('MCP Server error:', error);
        this.isConnected = false;
      });

      // Wait for connection
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('MCP Server connection timeout'));
        }, 30000);

        const checkConnection = setInterval(() => {
          if (this.isConnected) {
            clearTimeout(timeout);
            clearInterval(checkConnection);
            resolve();
          }
        }, 100);
      });

      return true;
    } catch (error) {
      console.error('Failed to start MCP server:', error);
      return false;
    }
  }

  async callTool(toolName, args) {
    if (!this.isConnected || !this.mcpProcess) {
      throw new Error('MCP Server not connected');
    }

    const requestId = ++this.requestIdCounter;

    const request = {
      jsonrpc: '2.0',
      id: requestId,
      method: 'tools/call',
      params: {
        name: toolName,
        arguments: args
      }
    };

    return new Promise((resolve, reject) => {
      this.pendingRequests.set(requestId, { resolve, reject });

      // Set timeout for request
      setTimeout(() => {
        if (this.pendingRequests.has(requestId)) {
          this.pendingRequests.delete(requestId);
          reject(new Error('Request timeout'));
        }
      }, 30000);

      this.mcpProcess.stdin.write(JSON.stringify(request) + '\n');
    });
  }

  async listTools() {
    if (!this.isConnected || !this.mcpProcess) {
      throw new Error('MCP Server not connected');
    }

    const requestId = ++this.requestIdCounter;

    const request = {
      jsonrpc: '2.0',
      id: requestId,
      method: 'tools/list'
    };

    return new Promise((resolve, reject) => {
      this.pendingRequests.set(requestId, { resolve, reject });

      setTimeout(() => {
        if (this.pendingRequests.has(requestId)) {
          this.pendingRequests.delete(requestId);
          reject(new Error('Request timeout'));
        }
      }, 10000);

      this.mcpProcess.stdin.write(JSON.stringify(request) + '\n');
    });
  }

  stop() {
    if (this.mcpProcess) {
      this.mcpProcess.kill();
      this.mcpProcess = null;
      this.isConnected = false;
    }
  }
}

// Initialize MCP interface
const mcpInterface = new MCPServerInterface();

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    let mcpStatus = 'disconnected';
    let tools = [];

    if (mcpInterface.isConnected) {
      mcpStatus = 'connected';
      try {
        const toolsResponse = await mcpInterface.listTools();
        tools = toolsResponse.result?.tools || [];
      } catch (error) {
        console.warn('Failed to list tools:', error.message);
      }
    }

    res.json({
      status: 'healthy',
      server: 'real_linkedin_mcp_wrapper',
      mcpServer: mcpStatus,
      timestamp: new Date().toISOString(),
      features: ['real_linkedin_scraping', 'multi_job_boards', 'ai_resume_scoring', 'claude_integration'],
      availableTools: tools.map(t => t.name)
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error.message
    });
  }
});

// Real LinkedIn Job Search
app.get('/api/linkedin/jobs', async (req, res) => {
  try {
    const { keywords = 'software engineer', location = '', limit = 20, remote = false } = req.query;

    console.log(`🔍 Real LinkedIn job search: ${keywords} in ${location}`);

    const result = await mcpInterface.callTool('fetch_jobs', {
      keywords,
      location,
      limit: parseInt(limit),
      remote: remote === 'true',
      includeLinkedIn: true
    });

    if (result.result) {
      const data = JSON.parse(result.result.content[0].text);

      if (data.success) {
        const jobs = data.data.jobs;

        // Format response for frontend compatibility
        const formattedJobs = jobs.map((job, index) =>
          `${index + 1}. **${job.title}** at ${job.company}\n   📍 ${job.location}\n   🔗 ${job.url || 'No URL'}\n   📊 Source: ${job.source}\n   📝 ${job.description.substring(0, 100)}...`
        );

        const response = {
          success: true,
          response: `## 🔍 Found ${jobs.length} Real Jobs from LinkedIn + Multiple Sources\n\n${formattedJobs.join('\n\n')}\n\n**Sources Used:** ${data.data.providers.join(', ')}\n**LinkedIn Jobs:** ${data.data.linkedInJobs}\n\nReal job data from live APIs! Would you like me to help you with cover letters for any of these positions?`,
          jobs: jobs,
          metadata: {
            total_jobs: data.data.total,
            providers: data.data.providers,
            linkedInJobs: data.data.linkedInJobs,
            realData: true
          }
        };

        res.json(response);
      } else {
        throw new Error(data.error || 'Job search failed');
      }
    } else {
      throw new Error('No response from MCP server');
    }
  } catch (error) {
    console.error('Real job search error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      response: `❌ **Real Job Search Error**\n\nCouldn't fetch real jobs: ${error.message}\n\nThe system includes:\n• LinkedIn job scraping\n• RemoteOK API\n• The Muse API\n• Adzuna API (if configured)\n\nPlease try again or check the server logs.`
    });
  }
});

// AI-Powered Resume Scoring with Real MCP
app.post('/api/career/resume-score', async (req, res) => {
  try {
    const { resumeContent, jobs } = req.body;

    if (!resumeContent || !jobs || !Array.isArray(jobs)) {
      return res.status(400).json({
        error: 'Resume content and jobs array are required'
      });
    }

    console.log('🤖 AI-powered resume scoring via real MCP');

    const result = await mcpInterface.callTool('score_jobs_against_resume', {
      resume: {
        content: resumeContent,
        skills: extractSkillsFromResume(resumeContent)
      },
      jobs: jobs
    });

    if (result.result) {
      const data = JSON.parse(result.result.content[0].text);

      if (data.success) {
        const scores = data.data.scores;
        const serviceUsed = data.data.serviceUsed;

        const formattedAnalysis = scores.map((score, index) =>
          `**${index + 1}. ${score.jobTitle} at ${score.company}**\n` +
          `   📊 Overall Score: ${score.overallScore}%\n` +
          `   🎯 Skills Match: ${score.skillsMatch}%\n` +
          `   ✅ Matching Skills: ${score.matchingSkills.join(', ')}\n` +
          `   💡 ${score.explanation}`
        ).join('\n\n');

        res.json({
          response: `## 📊 AI-Powered Resume Analysis\n\n${formattedAnalysis}\n\n---\n**Analysis Engine:** ${serviceUsed}\n*Real AI analysis by Claude or advanced algorithms*`,
          scores: scores,
          metadata: {
            serviceUsed,
            realAI: serviceUsed.includes('claude'),
            analysisDate: new Date().toISOString()
          }
        });
      } else {
        throw new Error(data.error || 'Resume scoring failed');
      }
    } else {
      throw new Error('No response from MCP server');
    }
  } catch (error) {
    console.error('Resume scoring error:', error);
    res.status(500).json({
      error: error.message,
      response: `❌ **Resume Analysis Error**\n\nCouldn't analyze resume: ${error.message}\n\nThe AI analysis includes:\n• Claude AI compatibility scoring\n• Skills matching analysis\n• Keyword optimization\n• Improvement recommendations`
    });
  }
});

// Real AI Cover Letter Generation
app.post('/api/career/cover-letter', async (req, res) => {
  try {
    const { jobTitle, companyName, jobDescription, resume, tone = 'professional', jobUrl } = req.body;

    if (!jobTitle || !companyName || !jobDescription || !resume) {
      return res.status(400).json({
        error: 'Job title, company name, job description, and resume are required'
      });
    }

    console.log('✍️ Real AI cover letter generation via MCP');

    const result = await mcpInterface.callTool('draft_cover_letter', {
      jobUrl: jobUrl || `https://jobs.com/${jobTitle.replace(/\s+/g, '-').toLowerCase()}`,
      jobTitle,
      companyName,
      jobDescription,
      resume,
      tone
    });

    if (result.result) {
      const data = JSON.parse(result.result.content[0].text);

      if (data.success) {
        const { coverLetter, analysis } = data.data;

        res.json({
          response: `## ✍️ AI-Generated Cover Letter\n\n${coverLetter}\n\n---\n**Analysis:**\n• Word Count: ${analysis.wordCount}\n• Character Count: ${analysis.characterCount}\n• Tone: ${analysis.tone}\n• AI Model: ${analysis.model}\n\n*Generated by Claude AI via Real MCP Server*`,
          coverLetter,
          analysis,
          metadata: {
            realAI: true,
            model: analysis.model,
            generatedAt: new Date().toISOString()
          }
        });
      } else {
        throw new Error(data.error || 'Cover letter generation failed');
      }
    } else {
      throw new Error('No response from MCP server');
    }
  } catch (error) {
    console.error('Cover letter generation error:', error);
    res.status(500).json({
      error: error.message,
      response: `❌ **Cover Letter Generation Error**\n\nCouldn't generate cover letter: ${error.message}\n\nRequires:\n• Anthropic API key configured\n• Job details and resume content\n• Real MCP server connection`
    });
  }
});

// Real AI LinkedIn Post Generation
app.post('/api/career/linkedin-post', async (req, res) => {
  try {
    const { content, tone = 'professional', includeHashtags = true, maxLength = 1300 } = req.body;

    if (!content) {
      return res.status(400).json({
        error: 'Content is required for LinkedIn post generation'
      });
    }

    console.log('📱 Real AI LinkedIn post generation via MCP');

    const result = await mcpInterface.callTool('draft_linkedin_post', {
      content,
      tone,
      includeHashtags,
      maxLength: parseInt(maxLength)
    });

    if (result.result) {
      const data = JSON.parse(result.result.content[0].text);

      if (data.success) {
        const { post, analysis } = data.data;

        res.json({
          response: `## 📱 AI-Generated LinkedIn Post\n\n${post}\n\n---\n**Analysis:**\n• Character Count: ${analysis.characterCount}\n• Word Count: ${analysis.wordCount}\n• Hashtags: ${analysis.hashtagCount} (${analysis.hashtags.join(', ')})\n• Engagement Score: ${analysis.engagementScore}%\n• AI Model: ${analysis.model}\n\n*Generated by Claude AI via Real MCP Server*`,
          post,
          analysis,
          metadata: {
            realAI: true,
            model: analysis.model,
            generatedAt: new Date().toISOString()
          }
        });
      } else {
        throw new Error(data.error || 'LinkedIn post generation failed');
      }
    } else {
      throw new Error('No response from MCP server');
    }
  } catch (error) {
    console.error('LinkedIn post generation error:', error);
    res.status(500).json({
      error: error.message,
      response: `❌ **LinkedIn Post Generation Error**\n\nCouldn't generate post: ${error.message}\n\nRequires:\n• Anthropic API key configured\n• Post content or topic\n• Real MCP server connection`
    });
  }
});

// Enhanced Career Chat with Real MCP Integration
app.post('/api/career/chat', async (req, res) => {
  try {
    const { message } = req.body;
    console.log('💬 Enhanced career chat request:', message);

    const messageText = message.toLowerCase();

    // Job search with real LinkedIn integration
    if (messageText.includes('job') || messageText.includes('find') || messageText.includes('search')) {
      const keywords = extractJobKeywords(message);
      const location = extractLocation(message);
      const remote = messageText.includes('remote');

      const result = await mcpInterface.callTool('fetch_jobs', {
        keywords,
        location,
        limit: 10,
        remote,
        includeLinkedIn: true
      });

      if (result.result) {
        const data = JSON.parse(result.result.content[0].text);

        if (data.success) {
          const jobs = data.data.jobs;

          const formattedJobs = jobs.slice(0, 5).map((job, index) =>
            `${index + 1}. **${job.title}** at ${job.company}\n   📍 ${job.location}\n   🔗 ${job.url || 'No URL'}\n   📊 ${job.source}\n   📝 ${job.description.substring(0, 100)}...`
          );

          return res.json({
            response: `## 🔍 Found ${jobs.length} Real Jobs (LinkedIn + APIs)\n\n${formattedJobs.join('\n\n')}\n\n**Live Sources:** ${data.data.providers.join(', ')}\n**LinkedIn Jobs:** ${data.data.linkedInJobs}\n\n*Real-time data from actual job boards!*\n\nWould you like me to help score these against your resume or write cover letters?`,
            toolUsed: 'real_linkedin_job_search',
            metadata: data.data
          });
        }
      }
    }

    // Default response for other queries
    return res.json({
      response: `🤖 **Enhanced AI Career Assistant with Real LinkedIn Integration**\n\nI can help you with:\n\n🔍 **Real LinkedIn Job Search** - "Find software engineer jobs"\n📊 **AI Resume Scoring** - "Score my resume against these jobs"\n✍️ **AI Cover Letters** - "Write a cover letter for [specific job]"\n📱 **AI LinkedIn Posts** - "Create a post about [topic]"\n\n**Enhanced Features:**\n• Live LinkedIn job scraping\n• Multi-API job aggregation (RemoteOK, The Muse, Adzuna)\n• Claude AI-powered analysis\n• Real-time data processing\n\nWhat would you like help with?`,
      toolUsed: 'enhanced_career_help'
    });

  } catch (error) {
    console.error('Enhanced career chat error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message,
      response: `❌ **Enhanced Career Assistant Error**\n\nSomething went wrong with the real MCP integration: ${error.message}\n\nThe system includes:\n• Real LinkedIn scraping\n• Multiple job board APIs\n• Claude AI integration\n• Advanced resume analysis\n\nPlease try again or check server status.`
    });
  }
});

// Helper functions
function extractJobKeywords(message) {
  const keywords = ['software', 'engineer', 'developer', 'programmer', 'frontend', 'backend', 'fullstack', 'react', 'javascript', 'python', 'java', 'data', 'scientist', 'analyst'];
  const words = message.toLowerCase().split(/\W+/);
  const found = words.filter(word => keywords.includes(word));
  return found.length > 0 ? found.join(' ') : 'software engineer';
}

function extractLocation(message) {
  const locations = ['remote', 'san francisco', 'new york', 'seattle', 'austin', 'boston', 'chicago', 'denver', 'los angeles'];
  const messageLower = message.toLowerCase();
  for (const location of locations) {
    if (messageLower.includes(location)) {
      return location;
    }
  }
  return '';
}

function extractSkillsFromResume(resumeContent) {
  const skillKeywords = [
    'javascript', 'python', 'java', 'react', 'angular', 'vue', 'node', 'express',
    'sql', 'nosql', 'mongodb', 'postgresql', 'aws', 'azure', 'docker', 'kubernetes',
    'git', 'agile', 'scrum', 'html', 'css', 'typescript', 'graphql', 'rest'
  ];

  const resumeLower = resumeContent.toLowerCase();
  return skillKeywords.filter(skill => resumeLower.includes(skill));
}

// Server startup
const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    console.log('🚀 Starting Real LinkedIn MCP Wrapper Server...');

    // Start the real MCP server
    const mcpStarted = await mcpInterface.startMCPServer();

    if (mcpStarted) {
      console.log('✅ Real MCP Server started successfully');

      app.listen(PORT, () => {
        console.log(`🌟 Real LinkedIn MCP Wrapper running on http://localhost:${PORT}`);
        console.log(`Available endpoints:`);
        console.log(`  Health: GET /health`);
        console.log(`  Real Jobs: GET /api/linkedin/jobs?keywords=...&location=...`);
        console.log(`  Resume Score: POST /api/career/resume-score`);
        console.log(`  Cover Letter: POST /api/career/cover-letter`);
        console.log(`  LinkedIn Post: POST /api/career/linkedin-post`);
        console.log(`  Enhanced Chat: POST /api/career/chat`);
        console.log('');
        console.log('🔥 REAL LINKEDIN INTEGRATION ACTIVE');
        console.log('📊 Multi-API job aggregation enabled');
        console.log('🤖 Claude AI integration ready');
      });
    } else {
      console.error('❌ Failed to start MCP server, exiting...');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Server startup error:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('📪 Shutting down Real MCP Wrapper...');
  mcpInterface.stop();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('📪 Shutting down Real MCP Wrapper...');
  mcpInterface.stop();
  process.exit(0);
});

// Start the server
startServer();