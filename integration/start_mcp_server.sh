#!/bin/bash

# Phase 1: LinkedIn MCP Setup Script
# This script sets up the adhikasp/mcp-linkedin server for your Gatsby website

echo "🚀 Setting up LinkedIn MCP Server - Phase 1"
echo "=========================================="

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed. Please install Python 3 first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed. Please install Node.js first."
    exit 1
fi

# Create MCP directory
echo "📁 Creating MCP directory..."
mkdir -p mcp-servers
cd mcp-servers

# Clone the LinkedIn MCP server
echo "📥 Cloning LinkedIn MCP server..."
if [ ! -d "mcp-linkedin" ]; then
    git clone https://github.com/adhikasp/mcp-linkedin.git
else
    echo "✅ MCP LinkedIn already exists, updating..."
    cd mcp-linkedin
    git pull
    cd ..
fi

cd mcp-linkedin

# Install Python dependencies
echo "📦 Installing Python dependencies..."
pip3 install -e .

# Install additional dependencies for web integration
echo "📦 Installing additional dependencies..."
pip3 install fastapi uvicorn python-dotenv anthropic

# Create environment file
echo "⚙️ Creating environment configuration..."
if [ ! -f ".env" ]; then
    cat > .env << EOL
# LinkedIn Credentials
LINKEDIN_EMAIL=your_linkedin_email@example.com
LINKEDIN_PASSWORD=your_linkedin_password

# Claude AI Configuration
ANTHROPIC_API_KEY=your_anthropic_api_key

# Server Configuration
MCP_SERVER_PORT=8001
EOL
    echo "📝 Created .env file. Please update with your credentials:"
    echo "   - LinkedIn email and password"
    echo "   - Anthropic API key for Claude"
else
    echo "✅ .env file already exists"
fi

# Create Claude Desktop configuration
echo "⚙️ Creating Claude Desktop configuration..."
CLAUDE_CONFIG_DIR="$HOME/.config/claude-desktop"
mkdir -p "$CLAUDE_CONFIG_DIR"

cat > "$CLAUDE_CONFIG_DIR/claude_desktop_config.json" << EOL
{
  "mcpServers": {
    "linkedin": {
      "command": "python3",
      "args": ["-m", "mcp_linkedin"],
      "cwd": "$(pwd)",
      "env": {
        "LINKEDIN_EMAIL": "your_linkedin_email@example.com",
        "LINKEDIN_PASSWORD": "your_linkedin_password"
      }
    }
  }
}
EOL

echo "✅ Claude Desktop configuration created"

# Create web server for Gatsby integration
echo "🌐 Creating web server for Gatsby integration..."
cat > web_server.py << 'EOL'
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
    username: str = "iarunpaul"
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
        # Simulate MCP interaction (in real implementation, this would use MCP client)
        # For now, we'll create a mock response and use Claude to format it
        
        mock_linkedin_data = {
            "recent_posts": [
                {
                    "content": "Excited to share insights on microservices architecture and how it transforms enterprise applications. The journey from monolith to microservices requires careful planning and execution. #SoftwareArchitecture #Microservices",
                    "engagement": {"likes": 45, "comments": 8, "shares": 12},
                    "date": "2025-01-15",
                    "themes": ["Software Architecture", "Microservices", "Enterprise Development"]
                },
                {
                    "content": "Just completed an amazing project using Angular 18 and Azure Functions. The new control flow syntax is a game-changer for reactive applications! 🚀 #Angular #Azure #WebDevelopment",
                    "engagement": {"likes": 67, "comments": 15, "shares": 8},
                    "date": "2025-01-12",
                    "themes": ["Angular", "Azure", "Web Development", "Frontend"]
                },
                {
                    "content": "Kubernetes deployment strategies: Blue-Green vs Rolling vs Canary. Each has its place in modern DevOps workflows. Here's when to use each approach... 🧵",
                    "engagement": {"likes": 89, "comments": 23, "shares": 34},
                    "date": "2025-01-10",
                    "themes": ["Kubernetes", "DevOps", "Deployment", "Cloud Native"]
                }
            ],
            "profile_metrics": {
                "total_posts": 3,
                "total_engagement": 301,
                "avg_engagement_per_post": 100.3,
                "top_themes": ["Software Architecture", "Cloud Technologies", "Web Development"]
            }
        }
        
        # Create prompt for Claude to generate professional summary
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
        
        # Generate summary using Claude
        message = anthropic_client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=2000,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )
        
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
        # This would use the actual MCP server in production
        # For now, return mock data
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
EOL

echo "✅ Web server created"

# Create startup script
echo "🚀 Creating startup script..."
cat > start_mcp_server.sh << 'EOL'
#!/bin/bash
echo "🚀 Starting LinkedIn MCP Web Server..."
python3 web_server.py
EOL

chmod +x start_mcp_server.sh

# Create test script
echo "🧪 Creating test script..."
cat > test_mcp.py << 'EOL'
#!/usr/bin/env python3
"""
Test script for LinkedIn MCP integration
"""

import requests
import json

def test_mcp_server():
    base_url = "http://localhost:8001"
    
    print("🧪 Testing LinkedIn MCP Server...")
    
    # Test health endpoint
    try:
        response = requests.get(f"{base_url}/health")
        if response.status_code == 200:
            print("✅ Health check passed")
        else:
            print("❌ Health check failed")
            return
    except Exception as e:
        print(f"❌ Server not running: {e}")
        return
    
    # Test LinkedIn summary generation
    try:
        response = requests.post(f"{base_url}/api/linkedin/summary", json={
            "username": "iarunpaul",
            "include_metrics": True,
            "include_themes": True,
            "include_topics": True,
            "max_posts": 10
        })
        
        if response.status_code == 200:
            data = response.json()
            print("✅ LinkedIn summary generated successfully")
            print("📄 Summary HTML preview:")
            print(data["summary_html"][:200] + "...")
        else:
            print(f"❌ Summary generation failed: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"❌ Summary test failed: {e}")

if __name__ == "__main__":
    test_mcp_server()
EOL

chmod +x test_mcp.py

# Create requirements file
echo "📋 Creating requirements.txt..."
cat > requirements.txt << EOL
fastapi>=0.104.0
uvicorn>=0.24.0
anthropic>=0.7.0
python-dotenv>=1.0.0
requests>=2.31.0
pydantic>=2.5.0
EOL

echo ""
echo "🎉 LinkedIn MCP Setup Complete!"
echo "================================"
echo ""
echo "📋 Next Steps:"
echo "1. Update .env file with your credentials:"
echo "   - LinkedIn email and password"
echo "   - Anthropic API key (get from https://console.anthropic.com/)"
echo ""
echo "2. Start the MCP web server:"
echo "   ./start_mcp_server.sh"
echo ""
echo "3. Test the integration:"
echo "   python3 test_mcp.py"
echo ""
echo "4. Integrate with your Gatsby website using the provided React components"
echo ""
echo "📁 Files created:"
echo "   - .env (update with your credentials)"
echo "   - web_server.py (FastAPI server for Gatsby integration)"
echo "   - start_mcp_server.sh (startup script)"
echo "   - test_mcp.py (test script)"
echo "   - requirements.txt (Python dependencies)"
echo ""
echo "🔗 API Endpoints:"
echo "   - GET  http://localhost:8001/health"
echo "   - POST http://localhost:8001/api/linkedin/summary"
echo "   - POST http://localhost:8001/api/linkedin/feed"
echo ""
EOL

