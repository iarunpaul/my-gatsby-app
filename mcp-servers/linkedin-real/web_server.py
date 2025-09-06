#!/usr/bin/env python3
"""
Real LinkedIn MCP Server Integration
Connects to the actual adhikasp/mcp-linkedin server
"""

import os
import json
import asyncio
import subprocess
from datetime import datetime
from typing import Dict, Any, List, Optional
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
import anthropic
from dotenv import load_dotenv
import logging
import httpx

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="LinkedIn MCP Integration Server",
    description="Real LinkedIn MCP server integration with Claude AI",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8000",
        "https://gray-pebble-0a500ec00.azurestaticapps.net",
        "https://web.iarunpaul.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global clients and state
anthropic_client = None
mcp_process = None
mcp_connected = False

class MCPLinkedInClient:
    """Client for communicating with LinkedIn MCP server"""
    
    def __init__(self):
        self.base_url = "http://localhost:3000"  # MCP server port
        self.session = None
        
    async def initialize(self):
        """Initialize HTTP session"""
        self.session = httpx.AsyncClient(timeout=30.0)
        
    async def close(self):
        """Close HTTP session"""
        if self.session:
            await self.session.aclose()
    
    async def call_tool(self, tool_name: str, arguments: Dict[str, Any]) -> Dict[str, Any]:
        """Call a tool on the MCP server"""
        if not self.session:
            await self.initialize()
            
        try:
            response = await self.session.post(
                f"{self.base_url}/call_tool",
                json={
                    "name": tool_name,
                    "arguments": arguments
                }
            )
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"MCP tool call failed: {e}")
            raise
    
    async def get_linkedin_feed(self, username: str, limit: int = 10) -> List[Dict[str, Any]]:
        """Get LinkedIn feed using MCP"""
        try:
            result = await self.call_tool("get_linkedin_feed", {
                "username": username,
                "limit": limit
            })
            return result.get("content", [])
        except Exception as e:
            logger.error(f"Failed to get LinkedIn feed: {e}")
            return []
    
    async def search_linkedin_jobs(self, keywords: str, location: str = "", limit: int = 5) -> List[Dict[str, Any]]:
        """Search LinkedIn jobs using MCP"""
        try:
            result = await self.call_tool("search_jobs", {
                "keywords": keywords,
                "location": location,
                "limit": limit
            })
            return result.get("content", [])
        except Exception as e:
            logger.error(f"Failed to search LinkedIn jobs: {e}")
            return []

# Initialize clients
mcp_client = MCPLinkedInClient()

def initialize_anthropic():
    """Initialize Anthropic client"""
    global anthropic_client
    
    try:
        anthropic_api_key = os.getenv("ANTHROPIC_API_KEY")
        if anthropic_api_key:
            anthropic_client = anthropic.Anthropic(api_key=anthropic_api_key)
            logger.info("✅ Anthropic client initialized")
        else:
            logger.warning("⚠️ Anthropic API key not found")
    except Exception as e:
        logger.error(f"❌ Anthropic initialization error: {e}")

async def start_mcp_server():
    """Start the LinkedIn MCP server as a subprocess"""
    global mcp_process, mcp_connected
    
    try:
        # Check if MCP server is already running
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get("http://localhost:3000/health", timeout=5.0)
                if response.status_code == 200:
                    logger.info("✅ MCP server already running")
                    mcp_connected = True
                    return
        except:
            pass
        
        # Start MCP server
        logger.info("🚀 Starting LinkedIn MCP server...")
        
        # Command to start the MCP server
        cmd = [
            "python", "-m", "mcp_linkedin.server",
            "--port", "3000",
            "--host", "0.0.0.0"
        ]
        
        mcp_process = subprocess.Popen(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            env={
                **os.environ,
                "LINKEDIN_EMAIL": os.getenv("LINKEDIN_EMAIL", ""),
                "LINKEDIN_PASSWORD": os.getenv("LINKEDIN_PASSWORD", "")
            }
        )
        
        # Wait a bit for server to start
        await asyncio.sleep(5)
        
        # Check if server is responding
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get("http://localhost:3000/health", timeout=10.0)
                if response.status_code == 200:
                    mcp_connected = True
                    logger.info("✅ LinkedIn MCP server started successfully")
                else:
                    logger.error("❌ MCP server not responding properly")
        except Exception as e:
            logger.error(f"❌ Failed to connect to MCP server: {e}")
            
    except Exception as e:
        logger.error(f"❌ Failed to start MCP server: {e}")

@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    logger.info("🚀 Starting LinkedIn MCP Integration Server...")
    
    # Initialize Anthropic
    initialize_anthropic()
    
    # Initialize MCP client
    await mcp_client.initialize()
    
    # Start MCP server
    await start_mcp_server()
    
    logger.info("✅ Server initialization complete")

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    global mcp_process
    
    logger.info("🛑 Shutting down server...")
    
    # Close MCP client
    await mcp_client.close()
    
    # Stop MCP server process
    if mcp_process:
        mcp_process.terminate()
        mcp_process.wait()
    
    logger.info("✅ Server shutdown complete")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "mcp_server": "real_linkedin",
        "mcp_connected": mcp_connected,
        "anthropic_available": anthropic_client is not None,
        "data_source": "adhikasp/mcp-linkedin"
    }

@app.get("/api/mcp/status")
async def mcp_status():
    """Get MCP server status"""
    try:
        if not mcp_connected:
            return {
                "connected": False,
                "status": "MCP server not connected",
                "timestamp": datetime.now().isoformat()
            }
        
        # Try to ping MCP server
        async with httpx.AsyncClient() as client:
            response = await client.get("http://localhost:3000/health", timeout=5.0)
            
        return {
            "connected": True,
            "status": "MCP server running",
            "mcp_response": response.json() if response.status_code == 200 else None,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        return {
            "connected": False,
            "status": f"MCP server error: {str(e)}",
            "timestamp": datetime.now().isoformat()
        }

@app.get("/api/linkedin/feed/{username}")
async def get_linkedin_feed(username: str, limit: int = 10):
    """Get LinkedIn feed using MCP server"""
    if not mcp_connected:
        raise HTTPException(status_code=503, detail="MCP server not connected")
    
    try:
        feed_data = await mcp_client.get_linkedin_feed(username, limit)
        
        return {
            "success": True,
            "username": username,
            "feed": feed_data,
            "count": len(feed_data),
            "data_source": "mcp-linkedin",
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error getting LinkedIn feed: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get LinkedIn feed: {str(e)}")

@app.get("/api/linkedin/jobs")
async def search_linkedin_jobs(keywords: str, location: str = "", limit: int = 5):
    """Search LinkedIn jobs using MCP server"""
    if not mcp_connected:
        raise HTTPException(status_code=503, detail="MCP server not connected")
    
    try:
        jobs_data = await mcp_client.search_linkedin_jobs(keywords, location, limit)
        
        return {
            "success": True,
            "keywords": keywords,
            "location": location,
            "jobs": jobs_data,
            "count": len(jobs_data),
            "data_source": "mcp-linkedin",
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error searching LinkedIn jobs: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to search LinkedIn jobs: {str(e)}")

@app.post("/api/linkedin/summary")
async def generate_linkedin_summary():
    """Generate AI-powered LinkedIn summary using MCP data"""
    try:
        username = os.getenv("GATSBY_LINKEDIN_USERNAME", "arun-paul-polly-741042b9")
        
        # Collect data from MCP if available
        linkedin_data = {}
        
        if mcp_connected:
            try:
                # Get LinkedIn feed
                feed_data = await mcp_client.get_linkedin_feed(username, 5)
                linkedin_data["feed"] = feed_data
                
                # Get job market data
                jobs_data = await mcp_client.search_linkedin_jobs("software architect", "", 3)
                linkedin_data["jobs"] = jobs_data
                
            except Exception as e:
                logger.warning(f"Could not fetch MCP data: {e}")
        
        # Generate AI summary
        if anthropic_client and linkedin_data:
            try:
                prompt = f"""
                Based on this LinkedIn data: {json.dumps(linkedin_data, indent=2)}
                
                Create a professional summary for a software architect's website that includes:
                1. Recent LinkedIn activity analysis
                2. Professional engagement insights
                3. Key technology focus areas
                4. Job market trends relevant to the profile
                
                Format as clean HTML suitable for a personal website.
                Make it engaging and professional.
                """
                
                message = anthropic_client.messages.create(
                    model="claude-3-5-haiku-20241022",
                    max_tokens=1500,
                    messages=[{"role": "user", "content": prompt}]
                )
                
                ai_summary = message.content[0].text
                
            except Exception as e:
                logger.warning(f"AI summary generation failed: {e}")
                ai_summary = get_fallback_summary()
        else:
            ai_summary = get_fallback_summary()
        
        return {
            "success": True,
            "summary_html": ai_summary,
            "data_source": "mcp-linkedin" if mcp_connected else "fallback",
            "mcp_data_available": bool(linkedin_data),
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error generating summary: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to generate summary: {str(e)}")

def get_fallback_summary():
    """Fallback summary when MCP/AI is not available"""
    return """
    <div class="linkedin-summary">
        <h3>🚀 Professional Technology Leadership</h3>
        <p>Leveraging LinkedIn MCP integration for dynamic professional content analysis:</p>
        <ul>
            <li><strong>Real-time Activity Monitoring:</strong> MCP-powered LinkedIn feed analysis</li>
            <li><strong>AI-Enhanced Insights:</strong> Claude AI processing of professional content</li>
            <li><strong>Market Intelligence:</strong> Job market trends and opportunities</li>
            <li><strong>Thought Leadership:</strong> Technical content sharing and engagement</li>
        </ul>
        <p><em>MCP server integration provides live LinkedIn data for dynamic professional showcase.</em></p>
    </div>
    """

@app.post("/api/mcp/restart")
async def restart_mcp_server(background_tasks: BackgroundTasks):
    """Restart the MCP server"""
    background_tasks.add_task(start_mcp_server)
    return {"message": "MCP server restart initiated"}

if __name__ == "__main__":
    import uvicorn
    
    host = os.getenv("MCP_SERVER_HOST", "0.0.0.0")
    port = int(os.getenv("MCP_SERVER_PORT", 8001))
    debug = os.getenv("DEBUG", "false").lower() == "true"
    
    logger.info(f"🚀 Starting Real LinkedIn MCP Integration Server on {host}:{port}")
    
    uvicorn.run(
        app,
        host=host,
        port=port,
        log_level="info" if not debug else "debug",
        reload=debug
    )

