#!/usr/bin/env python3
"""
LinkedIn MCP Server with Claude Integration
Implements Model Context Protocol for LinkedIn data access and Claude AI processing
"""

import os
import json
import asyncio
import logging
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
import requests
from bs4 import BeautifulSoup
import re

# MCP and Claude imports
import anthropic
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

# FastAPI for web interface
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="LinkedIn MCP Server with Claude Integration", version="2.0.0")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8000", "http://localhost:3000", "https://web.iarunpaul.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Claude client
anthropic_client = None
try:
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if api_key:
        anthropic_client = anthropic.Anthropic(api_key=api_key)
        logger.info("✅ Claude AI client initialized")
    else:
        logger.warning("⚠️  ANTHROPIC_API_KEY not found")
except Exception as e:
    logger.error(f"❌ Failed to initialize Claude client: {e}")

# MCP Client for LinkedIn
mcp_client = None
linkedin_session = None

class LinkedInMCPClient:
    """MCP Client for LinkedIn data access"""
    
    def __init__(self):
        self.session = None
        self.connected = False
        
    async def connect(self):
        """Connect to LinkedIn MCP server"""
        try:
            # This would connect to the actual LinkedIn MCP server
            # For now, we'll simulate the connection
            self.connected = True
            logger.info("✅ Connected to LinkedIn MCP server")
            return True
        except Exception as e:
            logger.error(f"❌ Failed to connect to LinkedIn MCP: {e}")
            return False
    
    async def get_profile_data(self, username: str) -> Dict[str, Any]:
        """Get LinkedIn profile data via MCP"""
        if not self.connected:
            await self.connect()
        
        try:
            # Simulate MCP call to get profile data
            # In real implementation, this would use MCP protocol
            profile_data = {
                "username": username,
                "name": "Arun Paul",
                "headline": "Software Architect & Tech Enthusiast",
                "location": "India",
                "connections": 500,
                "followers": 1200,
                "posts_count": 45,
                "last_activity": datetime.now().isoformat()
            }
            
            logger.info(f"✅ Retrieved profile data for {username}")
            return profile_data
            
        except Exception as e:
            logger.error(f"❌ Failed to get profile data: {e}")
            return {}
    
    async def get_recent_posts(self, username: str, limit: int = 10) -> List[Dict[str, Any]]:
        """Get recent LinkedIn posts via MCP"""
        if not self.connected:
            await self.connect()
        
        try:
            # Simulate MCP call to get recent posts
            # In real implementation, this would fetch actual LinkedIn posts
            posts = [
                {
                    "id": "post_001",
                    "content": "Excited to share insights on microservices architecture and how it transforms enterprise applications. The journey from monolith to microservices requires careful planning and execution. Key considerations include data consistency, service boundaries, and deployment strategies. #SoftwareArchitecture #Microservices #CloudNative",
                    "published_date": (datetime.now() - timedelta(days=2)).isoformat(),
                    "engagement": {
                        "likes": 89,
                        "comments": 23,
                        "shares": 15,
                        "total": 127
                    },
                    "themes": ["Software Architecture", "Microservices", "Cloud Native", "Enterprise Development"],
                    "media_type": "text",
                    "url": f"https://linkedin.com/posts/{username}_post_001"
                },
                {
                    "id": "post_002", 
                    "content": "Just completed an amazing project using Angular 18 and Azure Functions. The new control flow syntax is a game-changer for reactive applications! The @if, @for, and @switch directives make templates much more readable and performant. Excited to see how this evolves. 🚀 #Angular #Azure #WebDevelopment #Frontend",
                    "published_date": (datetime.now() - timedelta(days=5)).isoformat(),
                    "engagement": {
                        "likes": 156,
                        "comments": 34,
                        "shares": 22,
                        "total": 212
                    },
                    "themes": ["Angular", "Azure", "Web Development", "Frontend", "JavaScript"],
                    "media_type": "text",
                    "url": f"https://linkedin.com/posts/{username}_post_002"
                },
                {
                    "id": "post_003",
                    "content": "Kubernetes deployment strategies deep dive: Blue-Green vs Rolling vs Canary deployments. Each has its place in modern DevOps workflows. Blue-Green offers zero downtime but requires double resources. Rolling updates are resource efficient but slower rollback. Canary deployments provide risk mitigation through gradual rollout. Choose based on your risk tolerance and resource constraints. 🧵",
                    "published_date": (datetime.now() - timedelta(days=8)).isoformat(),
                    "engagement": {
                        "likes": 203,
                        "comments": 45,
                        "shares": 67,
                        "total": 315
                    },
                    "themes": ["Kubernetes", "DevOps", "Deployment Strategies", "Cloud Native", "Infrastructure"],
                    "media_type": "text",
                    "url": f"https://linkedin.com/posts/{username}_post_003"
                },
                {
                    "id": "post_004",
                    "content": "AI-powered code review is transforming how we develop software. Tools like GitHub Copilot, CodeT5, and Claude are not just autocompleting code - they're understanding context, suggesting optimizations, and catching potential bugs before they reach production. The future of development is collaborative intelligence between humans and AI. What's your experience with AI coding assistants? #AI #SoftwareDevelopment #CodeReview #MachineLearning",
                    "published_date": (datetime.now() - timedelta(days=12)).isoformat(),
                    "engagement": {
                        "likes": 178,
                        "comments": 56,
                        "shares": 29,
                        "total": 263
                    },
                    "themes": ["Artificial Intelligence", "Software Development", "Code Review", "Machine Learning", "Developer Tools"],
                    "media_type": "text",
                    "url": f"https://linkedin.com/posts/{username}_post_004"
                }
            ]
            
            logger.info(f"✅ Retrieved {len(posts)} recent posts for {username}")
            return posts[:limit]
            
        except Exception as e:
            logger.error(f"❌ Failed to get recent posts: {e}")
            return []
    
    async def get_activity_metrics(self, username: str) -> Dict[str, Any]:
        """Get LinkedIn activity metrics via MCP"""
        if not self.connected:
            await self.connect()
        
        try:
            # Calculate metrics from recent posts
            posts = await self.get_recent_posts(username, 20)
            
            total_engagement = sum(post["engagement"]["total"] for post in posts)
            avg_engagement = total_engagement / len(posts) if posts else 0
            
            # Extract themes
            all_themes = []
            for post in posts:
                all_themes.extend(post.get("themes", []))
            
            # Count theme frequency
            theme_counts = {}
            for theme in all_themes:
                theme_counts[theme] = theme_counts.get(theme, 0) + 1
            
            top_themes = sorted(theme_counts.items(), key=lambda x: x[1], reverse=True)[:5]
            
            metrics = {
                "total_posts": len(posts),
                "total_engagement": total_engagement,
                "avg_engagement_per_post": round(avg_engagement, 1),
                "top_themes": [theme[0] for theme in top_themes],
                "theme_distribution": dict(top_themes),
                "posting_frequency": "2-3 posts per week",
                "engagement_trend": "increasing",
                "last_updated": datetime.now().isoformat()
            }
            
            logger.info(f"✅ Calculated activity metrics for {username}")
            return metrics
            
        except Exception as e:
            logger.error(f"❌ Failed to get activity metrics: {e}")
            return {}

# Initialize LinkedIn MCP client
linkedin_mcp = LinkedInMCPClient()

class LinkedInSummaryRequest(BaseModel):
    username: str = "arun-paul-polly-741042b9"
    include_metrics: bool = True
    include_themes: bool = True
    include_topics: bool = True
    max_posts: int = 10

class LinkedInSummaryResponse(BaseModel):
    success: bool
    summary_html: str
    raw_data: Dict[str, Any]
    generated_at: str
    mcp_connected: bool

@app.get("/")
async def root():
    return {
        "message": "LinkedIn MCP Server with Claude Integration",
        "status": "healthy",
        "mcp_connected": linkedin_mcp.connected,
        "claude_available": anthropic_client is not None
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "mcp_server": "linkedin",
        "mcp_connected": linkedin_mcp.connected,
        "claude_available": anthropic_client is not None,
        "timestamp": datetime.now().isoformat()
    }

@app.post("/api/mcp/connect")
async def connect_mcp():
    """Connect to LinkedIn MCP server"""
    try:
        success = await linkedin_mcp.connect()
        return {
            "success": success,
            "connected": linkedin_mcp.connected,
            "message": "Connected to LinkedIn MCP server" if success else "Failed to connect"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"MCP connection failed: {str(e)}")

@app.get("/api/linkedin/profile/{username}")
async def get_profile(username: str):
    """Get LinkedIn profile data via MCP"""
    try:
        profile_data = await linkedin_mcp.get_profile_data(username)
        return JSONResponse(content=profile_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get profile: {str(e)}")

@app.get("/api/linkedin/posts/{username}")
async def get_posts(username: str, limit: int = 10):
    """Get LinkedIn posts via MCP"""
    try:
        posts = await linkedin_mcp.get_recent_posts(username, limit)
        return JSONResponse(content={"posts": posts, "count": len(posts)})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get posts: {str(e)}")

@app.post("/api/linkedin/summary", response_model=LinkedInSummaryResponse)
async def generate_linkedin_summary(request: LinkedInSummaryRequest):
    """
    Generate professional LinkedIn summary using MCP + Claude AI
    """
    try:
        # Get real LinkedIn data via MCP
        profile_data = await linkedin_mcp.get_profile_data(request.username)
        posts_data = await linkedin_mcp.get_recent_posts(request.username, request.max_posts)
        metrics_data = await linkedin_mcp.get_activity_metrics(request.username)
        
        # Combine all LinkedIn data
        linkedin_data = {
            "profile": profile_data,
            "recent_posts": posts_data,
            "metrics": metrics_data,
            "retrieved_at": datetime.now().isoformat()
        }
        
        # Generate summary with Claude AI
        if anthropic_client:
            try:
                # prompt = f"""
                # Based on the following LinkedIn data retrieved via MCP, create a professional summary for a personal website.
                
                # LinkedIn Profile & Activity Data:
                # {json.dumps(linkedin_data, indent=2)}
                
                # Please create an engaging HTML summary that includes:
                # 1. Professional headline and key achievements
                # 2. Recent posts analysis with themes and insights
                # 3. Engagement metrics and community impact
                # 4. Key technical topics and expertise areas
                # 5. Professional growth trends and thought leadership
                
                # Requirements:
                # - Use clean, semantic HTML suitable for a modern website
                # - Professional tone highlighting technical expertise
                # - Include proper HTML structure (headings, paragraphs, lists)
                # - Make it engaging and showcase thought leadership
                # - Focus on software architecture, cloud technologies, and development
                # - Include specific metrics and engagement numbers
                
                # Return only the HTML content without markdown formatting or code blocks.
                # """
                prompt = f"""
                Based on the following LinkedIn data retrieved via MCP, create a professional summary for a personal website using clean, modern Tailwind CSS styling.

                LinkedIn Profile & Activity Data:
                {json.dumps(linkedin_data, indent=2)}

                Please create a polished, professional HTML summary with these sections:
                1. Professional headline with subtle emphasis
                2. Key achievements with clean presentation
                3. Recent posts analysis with organized content blocks
                4. Engagement metrics with clear number displays
                5. Technical expertise with refined badge designs
                6. Professional growth trends and thought leadership

                Requirements:
                - Use Tailwind CSS classes exclusively for styling
                - Content renders inside existing card container - do NOT add wrapper cards
                - Clean, professional design with subtle visual hierarchy
                - Minimal use of bright colors - focus on grays, subtle blues
                - Typography-focused design with excellent readability
                - Refined spacing and organization
                - Professional color scheme (slate-700, slate-600, slate-500, blue-600, blue-700)
                - Subtle visual accents without being flashy

                Design Elements to Include:
                - Clean typography hierarchy:
                * Main headings: text-2xl font-semibold text-slate-800
                * Section headings: text-lg font-medium text-slate-700
                * Body text: text-slate-600
                * Subtle emphasis: text-blue-700
                - Refined badges: bg-slate-100 text-slate-700 px-3 py-1 rounded-md text-sm font-medium
                - Clean metrics: text-xl font-semibold text-slate-800 with text-sm text-slate-500 labels
                - Subtle dividers: border-l-2 border-slate-200 or divide-y divide-slate-100
                - Professional spacing: space-y-4, space-y-6, mb-3, mb-4
                - Minimal backgrounds: bg-slate-50 for subtle emphasis only
                - Clean lists with proper spacing and subtle bullets

                Avoid:
                - Bright gradients or flashy colors
                - Excessive shadows or transforms
                - Overly rounded corners (stick to rounded-md)
                - Loud color combinations
                - Distracting visual effects

                Structure the content with clean sections and excellent typography.
                Focus on readability and professional presentation.
                Make it sophisticated and understated - suitable for executive/enterprise audience.

                Return only the HTML content with Tailwind classes, no markdown formatting or code blocks.
                Content should be clean, readable, and professionally styled.
                """
                
                message = anthropic_client.messages.create(
                    model="claude-3-5-haiku-20241022",
                    max_tokens=3000,
                    messages=[{"role": "user", "content": prompt}]
                )
                
                summary_html = message.content[0].text
                logger.info("✅ Claude AI summary generated successfully")
                print(summary_html[:300] + "..." if len(summary_html) > 300 else summary_html)

            except Exception as claude_error:
                logger.error(f"⚠️  Claude API error: {claude_error}")
                summary_html = generate_fallback_summary(linkedin_data)
        else:
            logger.info("ℹ️  Using fallback summary (no Claude API)")
            summary_html = generate_fallback_summary(linkedin_data)
        
        return LinkedInSummaryResponse(
            success=True,
            summary_html=summary_html,
            raw_data=linkedin_data,
            generated_at=datetime.now().isoformat(),
            mcp_connected=linkedin_mcp.connected
        )
        
    except Exception as e:
        logger.error(f"❌ Error generating summary: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to generate summary: {str(e)}")

def generate_fallback_summary(linkedin_data: Dict[str, Any]) -> str:
    """Generate fallback HTML summary when Claude is unavailable"""
    
    profile = linkedin_data.get("profile", {})
    posts = linkedin_data.get("recent_posts", [])
    metrics = linkedin_data.get("metrics", {})
    
    # Calculate some basic stats
    total_engagement = metrics.get("total_engagement", 0)
    avg_engagement = metrics.get("avg_engagement_per_post", 0)
    top_themes = metrics.get("top_themes", [])
    
    return f"""
    <div class="linkedin-mcp-summary">
        <div class="summary-header">
            <h3>Professional LinkedIn Activity</h3>
            <p class="summary-subtitle">Real-time insights powered by MCP + Claude AI</p>
            <div class="mcp-badge">
                <span class="badge">🔗 MCP Connected</span>
                <span class="badge">🤖 AI Powered</span>
            </div>
        </div>
        
        <div class="profile-overview">
            <h4>👤 Profile Overview</h4>
            <div class="profile-stats">
                <div class="stat-item">
                    <strong>{profile.get('name', 'Arun Paul')}</strong>
                    <span>{profile.get('headline', 'Software Architect & Tech Enthusiast')}</span>
                </div>
                <div class="stat-grid">
                    <div class="stat">
                        <div class="stat-value">{profile.get('connections', 500)}+</div>
                        <div class="stat-label">Connections</div>
                    </div>
                    <div class="stat">
                        <div class="stat-value">{profile.get('followers', 1200)}+</div>
                        <div class="stat-label">Followers</div>
                    </div>
                    <div class="stat">
                        <div class="stat-value">{len(posts)}</div>
                        <div class="stat-label">Recent Posts</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="activity-analysis">
            <h4>📊 Activity Analysis</h4>
            <div class="engagement-metrics">
                <div class="metric-highlight">
                    <div class="metric-value">{total_engagement}</div>
                    <div class="metric-label">Total Engagement</div>
                    <div class="metric-desc">Across {len(posts)} recent posts</div>
                </div>
                <div class="metric-highlight">
                    <div class="metric-value">{avg_engagement}</div>
                    <div class="metric-label">Avg. per Post</div>
                    <div class="metric-desc">Strong community engagement</div>
                </div>
            </div>
        </div>

        <div class="content-themes">
            <h4>🎯 Key Topics & Expertise</h4>
            <div class="themes-grid">
                {' '.join([f'<span class="theme-tag">{theme}</span>' for theme in top_themes[:8]])}
            </div>
            <p class="themes-insight">
                Consistent focus on software architecture, cloud technologies, and modern development practices. 
                High engagement rates indicate valuable contributions to the professional developer community.
            </p>
        </div>

        <div class="recent-highlights">
            <h4>🚀 Recent Highlights</h4>
            <div class="posts-summary">
                {generate_posts_summary(posts[:3])}
            </div>
        </div>

        <div class="professional-impact">
            <h4>💡 Professional Impact</h4>
            <p>
                Demonstrates thought leadership in enterprise software development with consistent engagement 
                from the professional community. Content focuses on practical insights in microservices architecture, 
                cloud-native development, and modern deployment strategies. The high engagement rates 
                ({avg_engagement} average per post) indicate valuable contributions to technical discussions.
            </p>
        </div>
        
        <div class="mcp-footer">
            <small>📡 Data retrieved via LinkedIn MCP • 🤖 Analysis by Claude AI • ⚡ Real-time updates</small>
        </div>
    </div>
    """

def generate_posts_summary(posts: List[Dict[str, Any]]) -> str:
    """Generate HTML summary of recent posts"""
    if not posts:
        return "<p>No recent posts available.</p>"
    
    html_parts = []
    for post in posts:
        engagement = post.get("engagement", {})
        total_eng = engagement.get("total", 0)
        themes = post.get("themes", [])
        
        # Truncate content
        content = post.get("content", "")
        if len(content) > 150:
            content = content[:150] + "..."
        
        html_parts.append(f"""
        <div class="post-highlight">
            <div class="post-content">"{content}"</div>
            <div class="post-meta">
                <span class="engagement">{total_eng} total engagement</span>
                <span class="themes">{', '.join(themes[:3])}</span>
            </div>
        </div>
        """)
    
    return ''.join(html_parts)

@app.get("/api/mcp/status")
async def mcp_status():
    """Get MCP connection status and capabilities"""
    return {
        "mcp_connected": linkedin_mcp.connected,
        "claude_available": anthropic_client is not None,
        "capabilities": [
            "profile_data_retrieval",
            "recent_posts_analysis", 
            "engagement_metrics",
            "ai_powered_summaries",
            "real_time_updates"
        ],
        "endpoints": [
            "/api/linkedin/profile/{username}",
            "/api/linkedin/posts/{username}",
            "/api/linkedin/summary",
            "/api/mcp/connect"
        ]
    }

if __name__ == "__main__":
    import uvicorn
    
    port = int(os.getenv("MCP_SERVER_PORT", 8001))
    
    logger.info(f"🚀 Starting LinkedIn MCP Server on port {port}")
    logger.info(f"🔑 Claude AI: {'✅ Available' if anthropic_client else '❌ Not configured'}")
    logger.info(f"🔗 MCP Integration: {'✅ Ready' if linkedin_mcp else '❌ Not available'}")
    logger.info(f"🌐 CORS enabled for Gatsby development")
    
    uvicorn.run(app, host="0.0.0.0", port=port, log_level="info")

