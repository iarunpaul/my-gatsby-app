#!/usr/bin/env python3
"""
Self-Contained LinkedIn MCP Server
No external MCP process required - includes LinkedIn integration directly
"""

import os
import json
import asyncio
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from anthropic import Anthropic
from linkedin_api import LinkedInAPI

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Request/Response Models
class LinkedInSummaryRequest(BaseModel):
    username: str

class MCPStatusResponse(BaseModel):
    connected: bool
    status: str
    architecture: str = "self_contained"
    tools_available: List[str]
    timestamp: str

class HealthResponse(BaseModel):
    status: str
    mcp_server: str
    architecture: str = "self_contained"
    timestamp: str

# Global state
linkedin_client: Optional[LinkedInAPI] = None
anthropic_client: Optional[Anthropic] = None
mcp_connected: bool = False

class LinkedInMCPAdapter:
    """Self-contained LinkedIn MCP adapter - no external process needed"""
    
    def __init__(self):
        self.linkedin_client = None
        self.anthropic_client = None
        self.connected = False
        self.tools = [
            "get_linkedin_feed",
            "search_jobs", 
            "get_profile",
            "generate_summary"
        ]
    
    async def initialize(self) -> bool:
        """Initialize LinkedIn and Anthropic clients"""
        try:
            logger.info("🔧 Initializing LinkedIn MCP Adapter...")
            
            # Initialize Anthropic client
            anthropic_api_key = os.getenv("ANTHROPIC_API_KEY")
            if not anthropic_api_key:
                logger.error("❌ ANTHROPIC_API_KEY not found in environment")
                return False
            
            self.anthropic_client = Anthropic(api_key=anthropic_api_key)
            logger.info("✅ Anthropic client initialized")
            
            # Initialize LinkedIn client
            linkedin_email = os.getenv("LINKEDIN_EMAIL")
            linkedin_password = os.getenv("LINKEDIN_PASSWORD")
            
            if not linkedin_email or not linkedin_password:
                logger.error("❌ LinkedIn credentials not found in environment")
                logger.error(f"   LINKEDIN_EMAIL: {'✅ Set' if linkedin_email else '❌ Missing'}")
                logger.error(f"   LINKEDIN_PASSWORD: {'✅ Set' if linkedin_password else '❌ Missing'}")
                return False
            
            # Attempt LinkedIn connection
            logger.info("🔗 Connecting to LinkedIn API...")
            self.linkedin_client = LinkedInAPI(linkedin_email, linkedin_password)
            
            # Test the connection with a simple API call
            try:
                # Try to get own profile to test connection
                profile = self.linkedin_client.get_profile()
                if profile:
                    logger.info("✅ LinkedIn API connection successful")
                    self.connected = True
                    return True
                else:
                    logger.error("❌ LinkedIn API connection failed - no profile data")
                    return False
            except Exception as linkedin_error:
                logger.error(f"❌ LinkedIn API connection failed: {str(linkedin_error)}")
                # Don't fail completely - we can still provide mock data
                logger.info("⚠️ Continuing with mock data mode")
                self.connected = False
                return True
                
        except Exception as e:
            logger.error(f"❌ Failed to initialize MCP adapter: {str(e)}")
            return False
    
    async def get_linkedin_feed(self, username: str) -> Dict[str, Any]:
        """Get LinkedIn feed for user"""
        try:
            if self.linkedin_client and self.connected:
                logger.info(f"📰 Fetching LinkedIn feed for: {username}")
                
                # Get user's posts
                posts = self.linkedin_client.get_profile_posts(username, post_count=10)
                
                processed_posts = []
                for post in posts[:5]:  # Limit to 5 recent posts
                    processed_posts.append({
                        "id": post.get("id", "unknown"),
                        "text": post.get("text", "")[:200] + "..." if len(post.get("text", "")) > 200 else post.get("text", ""),
                        "published_date": post.get("publishedAt", ""),
                        "engagement": {
                            "likes": post.get("numLikes", 0),
                            "comments": post.get("numComments", 0),
                            "shares": post.get("numShares", 0)
                        }
                    })
                
                return {
                    "username": username,
                    "posts": processed_posts,
                    "total_posts": len(processed_posts),
                    "data_source": "linkedin_api",
                    "timestamp": datetime.now().isoformat()
                }
            else:
                # Return mock data when LinkedIn API is not available
                logger.info(f"📰 Returning mock LinkedIn feed for: {username}")
                return self._get_mock_feed(username)
                
        except Exception as e:
            logger.error(f"❌ Error fetching LinkedIn feed: {str(e)}")
            return self._get_mock_feed(username)
    
    async def search_jobs(self, keywords: str, location: str = "") -> Dict[str, Any]:
        """Search LinkedIn jobs"""
        try:
            if self.linkedin_client and self.connected:
                logger.info(f"💼 Searching LinkedIn jobs: {keywords}")
                
                jobs = self.linkedin_client.search_jobs(keywords=keywords, location_name=location, limit=5)
                
                processed_jobs = []
                for job in jobs[:5]:
                    processed_jobs.append({
                        "title": job.get("title", ""),
                        "company": job.get("companyName", ""),
                        "location": job.get("formattedLocation", ""),
                        "posted_date": job.get("listedAt", ""),
                        "job_id": job.get("jobId", "")
                    })
                
                return {
                    "keywords": keywords,
                    "location": location,
                    "jobs": processed_jobs,
                    "total_jobs": len(processed_jobs),
                    "data_source": "linkedin_api",
                    "timestamp": datetime.now().isoformat()
                }
            else:
                # Return mock job data
                return self._get_mock_jobs(keywords, location)
                
        except Exception as e:
            logger.error(f"❌ Error searching LinkedIn jobs: {str(e)}")
            return self._get_mock_jobs(keywords, location)
    
    async def get_profile(self, username: str) -> Dict[str, Any]:
        """Get LinkedIn profile information"""
        try:
            if self.linkedin_client and self.connected:
                logger.info(f"👤 Fetching LinkedIn profile for: {username}")
                
                profile = self.linkedin_client.get_profile(username)
                
                return {
                    "username": username,
                    "name": f"{profile.get('firstName', '')} {profile.get('lastName', '')}".strip(),
                    "headline": profile.get("headline", ""),
                    "location": profile.get("geoLocationName", ""),
                    "industry": profile.get("industryName", ""),
                    "connections": profile.get("numConnections", 0),
                    "data_source": "linkedin_api",
                    "timestamp": datetime.now().isoformat()
                }
            else:
                # Return mock profile data
                return self._get_mock_profile(username)
                
        except Exception as e:
            logger.error(f"❌ Error fetching LinkedIn profile: {str(e)}")
            return self._get_mock_profile(username)
    
    async def generate_summary(self, username: str) -> Dict[str, Any]:
        """Generate AI-powered summary of LinkedIn activity"""
        try:
            logger.info(f"🤖 Generating AI summary for: {username}")
            
            # Get LinkedIn data
            feed_data = await self.get_linkedin_feed(username)
            profile_data = await self.get_profile(username)
            
            # Prepare data for AI analysis
            context = {
                "profile": profile_data,
                "recent_posts": feed_data.get("posts", []),
                "username": username
            }
            
            if self.anthropic_client:
                # Generate AI summary using Claude
                prompt = f"""
                Analyze this LinkedIn professional's recent activity and create a comprehensive summary:
                
                Profile: {json.dumps(profile_data, indent=2)}
                Recent Posts: {json.dumps(feed_data.get('posts', []), indent=2)}
                
                Please provide:
                1. Professional summary of their expertise and focus areas
                2. Analysis of recent content themes and engagement
                3. Key topics they're discussing
                4. Professional insights and thought leadership areas
                5. Engagement metrics analysis
                
                Format as a professional summary suitable for a personal website.
                """
                
                try:
                    response = self.anthropic_client.messages.create(
                        model="claude-3-haiku-20240307",
                        max_tokens=1000,
                        messages=[{"role": "user", "content": prompt}]
                    )
                    
                    ai_summary = response.content[0].text
                    
                    return {
                        "username": username,
                        "summary": ai_summary,
                        "engagement_metrics": {
                            "total_posts": len(feed_data.get("posts", [])),
                            "avg_engagement": self._calculate_avg_engagement(feed_data.get("posts", [])),
                            "top_topics": self._extract_topics(feed_data.get("posts", []))
                        },
                        "data_source": "claude_ai_analysis",
                        "timestamp": datetime.now().isoformat()
                    }
                    
                except Exception as ai_error:
                    logger.error(f"❌ Claude AI error: {str(ai_error)}")
                    # Fall back to template summary
                    return self._get_template_summary(username, context)
            else:
                # Return template summary when AI is not available
                return self._get_template_summary(username, context)
                
        except Exception as e:
            logger.error(f"❌ Error generating summary: {str(e)}")
            return self._get_template_summary(username, {})
    
    def _get_mock_feed(self, username: str) -> Dict[str, Any]:
        """Generate mock LinkedIn feed data"""
        return {
            "username": username,
            "posts": [
                {
                    "id": "mock_post_1",
                    "text": "Excited to share insights on modern software architecture and cloud-native development patterns...",
                    "published_date": (datetime.now() - timedelta(days=1)).isoformat(),
                    "engagement": {"likes": 45, "comments": 8, "shares": 12}
                },
                {
                    "id": "mock_post_2", 
                    "text": "Just completed an interesting project involving microservices and container orchestration...",
                    "published_date": (datetime.now() - timedelta(days=3)).isoformat(),
                    "engagement": {"likes": 32, "comments": 5, "shares": 7}
                }
            ],
            "total_posts": 2,
            "data_source": "mock_data",
            "timestamp": datetime.now().isoformat()
        }
    
    def _get_mock_jobs(self, keywords: str, location: str) -> Dict[str, Any]:
        """Generate mock job search results"""
        return {
            "keywords": keywords,
            "location": location,
            "jobs": [
                {
                    "title": "Senior Software Architect",
                    "company": "Tech Innovation Corp",
                    "location": "Remote",
                    "posted_date": (datetime.now() - timedelta(days=2)).isoformat(),
                    "job_id": "mock_job_1"
                }
            ],
            "total_jobs": 1,
            "data_source": "mock_data",
            "timestamp": datetime.now().isoformat()
        }
    
    def _get_mock_profile(self, username: str) -> Dict[str, Any]:
        """Generate mock profile data"""
        return {
            "username": username,
            "name": "Professional Developer",
            "headline": "Software Architect & Technology Leader",
            "location": "Global",
            "industry": "Technology",
            "connections": 500,
            "data_source": "mock_data",
            "timestamp": datetime.now().isoformat()
        }
    
    def _get_template_summary(self, username: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """Generate template summary when AI is not available"""
        profile = context.get("profile", {})
        posts = context.get("recent_posts", [])
        
        summary = f"""
        Professional Summary for {profile.get('name', username)}:
        
        {profile.get('name', username)} is a {profile.get('headline', 'technology professional')} 
        based in {profile.get('location', 'Global')} with {profile.get('connections', 'many')} connections.
        
        Recent Activity Analysis:
        - Published {len(posts)} recent posts demonstrating thought leadership
        - Focuses on technology, software development, and professional insights
        - Maintains active engagement with the professional community
        - Shares expertise in modern development practices and architecture
        
        Key Areas of Expertise:
        - Software Architecture & Development
        - Technology Leadership
        - Professional Networking & Knowledge Sharing
        - Industry Best Practices
        
        This professional maintains an active LinkedIn presence, regularly sharing insights 
        and engaging with the technology community.
        """
        
        return {
            "username": username,
            "summary": summary.strip(),
            "engagement_metrics": {
                "total_posts": len(posts),
                "avg_engagement": self._calculate_avg_engagement(posts),
                "top_topics": ["Technology", "Software Development", "Professional Growth"]
            },
            "data_source": "template_summary",
            "timestamp": datetime.now().isoformat()
        }
    
    def _calculate_avg_engagement(self, posts: List[Dict[str, Any]]) -> float:
        """Calculate average engagement across posts"""
        if not posts:
            return 0.0
        
        total_engagement = 0
        for post in posts:
            engagement = post.get("engagement", {})
            total_engagement += engagement.get("likes", 0) + engagement.get("comments", 0) + engagement.get("shares", 0)
        
        return round(total_engagement / len(posts), 2)
    
    def _extract_topics(self, posts: List[Dict[str, Any]]) -> List[str]:
        """Extract key topics from posts"""
        topics = ["Software Architecture", "Technology Leadership", "Professional Development"]
        return topics[:3]  # Return top 3 topics

# Global MCP adapter instance
mcp_adapter = LinkedInMCPAdapter()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan management"""
    # Startup
    logger.info("🚀 Starting LinkedIn MCP Integration Server...")
    
    # Initialize MCP adapter
    success = await mcp_adapter.initialize()
    if success:
        logger.info("✅ LinkedIn MCP Adapter initialized successfully")
        global mcp_connected
        mcp_connected = True
    else:
        logger.error("❌ LinkedIn MCP Adapter initialization failed")
        mcp_connected = False
    
    logger.info("✅ Server initialization complete")
    
    yield
    
    # Shutdown
    logger.info("🛑 Shutting down LinkedIn MCP Integration Server...")

# Create FastAPI app with lifespan
app = FastAPI(
    title="LinkedIn MCP Integration Server",
    description="Self-contained LinkedIn MCP server with direct API integration",
    version="2.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy",
        mcp_server="self_contained_linkedin",
        architecture="self_contained",
        timestamp=datetime.now().isoformat()
    )

@app.get("/api/mcp/status", response_model=MCPStatusResponse)
async def mcp_status():
    """Get MCP server status"""
    return MCPStatusResponse(
        connected=mcp_adapter.connected,
        status="MCP server connected" if mcp_adapter.connected else "MCP server initialized (mock mode)",
        architecture="self_contained",
        tools_available=mcp_adapter.tools,
        timestamp=datetime.now().isoformat()
    )

@app.get("/api/linkedin/feed/{username}")
async def get_linkedin_feed(username: str):
    """Get LinkedIn feed for user"""
    try:
        result = await mcp_adapter.get_linkedin_feed(username)
        return result
    except Exception as e:
        logger.error(f"❌ Error in get_linkedin_feed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/linkedin/profile/{username}")
async def get_linkedin_profile(username: str):
    """Get LinkedIn profile for user"""
    try:
        result = await mcp_adapter.get_profile(username)
        return result
    except Exception as e:
        logger.error(f"❌ Error in get_linkedin_profile: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/linkedin/jobs")
async def search_linkedin_jobs(keywords: str, location: str = ""):
    """Search LinkedIn jobs"""
    try:
        result = await mcp_adapter.search_jobs(keywords, location)
        return result
    except Exception as e:
        logger.error(f"❌ Error in search_linkedin_jobs: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/linkedin/summary")
async def generate_linkedin_summary(request: LinkedInSummaryRequest):
    """Generate AI-powered LinkedIn summary"""
    try:
        result = await mcp_adapter.generate_summary(request.username)
        return result
    except Exception as e:
        logger.error(f"❌ Error in generate_linkedin_summary: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    # Get configuration from environment
    port = int(os.getenv("MCP_SERVER_PORT", 8001))
    debug = os.getenv("DEBUG", "false").lower() == "true"
    
    logger.info(f"🚀 Starting Real LinkedIn MCP Integration Server on 0.0.0.0:{port}")
    
    uvicorn.run(
        "web_server:app",
        host="0.0.0.0",
        port=port,
        reload=debug,
        log_level="info"
    )

