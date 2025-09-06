#!/usr/bin/env python3
"""
LinkedIn MCP Web Server for Gatsby Integration
Provides REST API endpoints to interact with LinkedIn MCP server
"""

import os
import json
import asyncio
from typing import Dict, List, Any
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import anthropic
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(title="LinkedIn MCP Web Server", version="1.0.0")

# Enable CORS for Gatsby development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8000", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Anthropic client
anthropic_client = anthropic.Anthropic(
    api_key=os.getenv("ANTHROPIC_API_KEY")
)

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

@app.get("/")
async def root():
    return {"message": "LinkedIn MCP Web Server is running", "status": "healthy"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "mcp_server": "linkedin"}

@app.post("/api/linkedin/summary", response_model=LinkedInSummaryResponse)
async def generate_linkedin_summary(request: LinkedInSummaryRequest):
    """
    Generate a professional LinkedIn activity summary using Claude AI + MCP
    """
    try:
        mock_linkedin_data = {
            "recent_posts": [
                {
                    "content": "Excited to share insights on microservices architecture and how it transforms enterprise applications. The journey from monolith to microservices requires careful planning and execution. #SoftwareArchitecture #Microservices",
                    "engagement": {"likes": 45, "comments": 8, "shares": 12},
                    "date": "2025-01-15",
                    "themes": ["Software Architecture", "Microservices", "Enterprise Development"]
                },
                {
                    "content": "Just completed an amazing project using Angular 18 and Azure Functions. The new control flow syntax is a game-changer for reactive applications! #Angular #Azure #WebDevelopment",
                    "engagement": {"likes": 67, "comments": 15, "shares": 8},
                    "date": "2025-01-12",
                    "themes": ["Angular", "Azure", "Web Development", "Frontend"]
                }
            ],
            "profile_metrics": {
                "total_posts": 2,
                "total_engagement": 215,
                "avg_engagement_per_post": 107.5,
                "top_themes": ["Software Architecture", "Cloud Technologies", "Web Development"]
            }
        }
        
        prompt = f"""
        Based on the following LinkedIn activity data, create a professional summary for a personal website.
        
        LinkedIn Data:
        {json.dumps(mock_linkedin_data, indent=2)}
        
        Please create an HTML summary that includes:
        1. Recent posts and their themes
        2. Professional engagement metrics
        3. Key topics being discussed
        4. Professional insights and trends
        
        Format as clean, semantic HTML suitable for a modern website. Use professional language and highlight technical expertise.
        Include proper HTML structure with headings, paragraphs, and lists where appropriate.
        Make it engaging and showcase professional growth and thought leadership.
        
        Return only the HTML content without any markdown formatting or code blocks.
        """
        
        message = anthropic_client.messages.create(
            model="claude-opus-4-1-20250805",
            max_tokens=2000,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )
        print("Claude Response:", message)
        
        summary_html = message.content[0].text
        
        return LinkedInSummaryResponse(
            success=True,
            summary_html=summary_html,
            raw_data=mock_linkedin_data,
            generated_at="2025-01-15T10:30:00Z"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate summary: {str(e)}")

@app.post("/api/linkedin/feed")
async def get_linkedin_feed():
    """
    Get LinkedIn feed data (placeholder for MCP integration)
    """
    try:
        mock_feed = {
            "posts": [
                {
                    "id": "post-1",
                    "content": "Exploring the latest in cloud-native architecture...",
                    "author": "iarunpaul",
                    "engagement": {"likes": 45, "comments": 8},
                    "timestamp": "2025-01-15T10:30:00Z"
                }
            ],
            "total_posts": 1,
            "last_updated": "2025-01-15T10:30:00Z"
        }
        
        return JSONResponse(content=mock_feed)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch feed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("MCP_SERVER_PORT", 8001))
    uvicorn.run(app, host="0.0.0.0", port=port)
