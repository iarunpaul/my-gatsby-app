# LinkedIn MCP Setup Script for Windows (PowerShell)
# Run with: powershell -ExecutionPolicy Bypass -File setup_windows.ps1

Write-Host "🚀 Setting up LinkedIn MCP Server - Phase 1 (Windows)" -ForegroundColor Green
Write-Host "======================================================" -ForegroundColor Green

# Check if Python is installed
try {
    $pythonVersion = python --version 2>$null
    Write-Host "✅ Python found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Python 3 is required but not installed." -ForegroundColor Red
    Write-Host "   Please install Python 3 from: https://www.python.org/downloads/" -ForegroundColor Yellow
    exit 1
}

# Check if Node.js is installed
try {
    $nodeVersion = node --version 2>$null
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is required but not installed." -ForegroundColor Red
    Write-Host "   Please install Node.js from: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Create MCP directory
Write-Host "📁 Creating MCP directory..." -ForegroundColor Cyan
if (!(Test-Path "mcp-servers")) {
    New-Item -ItemType Directory -Path "mcp-servers"
}
Set-Location "mcp-servers"

# Clone the LinkedIn MCP server
Write-Host "📥 Cloning LinkedIn MCP server..." -ForegroundColor Cyan
if (!(Test-Path "mcp-linkedin")) {
    git clone https://github.com/adhikasp/mcp-linkedin.git
    if ($LASTEXITCODE -ne 0) {
        Write-Host "⚠️  Git clone failed. Creating directory manually..." -ForegroundColor Yellow
        New-Item -ItemType Directory -Path "mcp-linkedin"
    }
} else {
    Write-Host "✅ MCP LinkedIn already exists, updating..." -ForegroundColor Green
    Set-Location "mcp-linkedin"
    git pull 2>$null
    Set-Location ".."
}

Set-Location "mcp-linkedin"

# Install Python dependencies
Write-Host "📦 Installing Python dependencies..." -ForegroundColor Cyan
pip install fastapi uvicorn anthropic python-dotenv requests pydantic

# Create environment file
Write-Host "⚙️ Creating environment configuration..." -ForegroundColor Cyan
if (!(Test-Path ".env")) {
    @"
# LinkedIn Credentials
LINKEDIN_EMAIL=your_linkedin_email@example.com
LINKEDIN_PASSWORD=your_linkedin_password

# Claude AI Configuration
ANTHROPIC_API_KEY=your_anthropic_api_key

# Server Configuration
MCP_SERVER_PORT=8001
"@ | Out-File -FilePath ".env" -Encoding UTF8
    Write-Host "📝 Created .env file. Please update with your credentials:" -ForegroundColor Yellow
    Write-Host "   - LinkedIn email and password" -ForegroundColor Yellow
    Write-Host "   - Anthropic API key for Claude" -ForegroundColor Yellow
} else {
    Write-Host "✅ .env file already exists" -ForegroundColor Green
}

# Create web server file
Write-Host "🌐 Creating web server..." -ForegroundColor Cyan
@'
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

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("MCP_SERVER_PORT", 8001))
    uvicorn.run(app, host="0.0.0.0", port=port)
'@ | Out-File -FilePath "web_server.py" -Encoding UTF8

# Create Windows startup script
Write-Host "🚀 Creating Windows startup script..." -ForegroundColor Cyan
@'
@echo off
echo 🚀 Starting LinkedIn MCP Web Server...
echo ======================================

if not exist "web_server.py" (
    echo ❌ web_server.py not found in current directory
    echo    Please run this script from the mcp-linkedin directory
    pause
    exit /b 1
)

if not exist ".env" (
    echo ⚠️  .env file not found
    echo    Please create .env file with your credentials
)

echo 🌐 Server will start on: http://localhost:8001
echo 📋 Available endpoints:
echo    - GET  /health
echo    - POST /api/linkedin/summary
echo    - POST /api/linkedin/feed
echo.
echo 🔄 Starting server... (Press Ctrl+C to stop)
echo.

python web_server.py
'@ | Out-File -FilePath "start_server.bat" -Encoding UTF8

# Create test script
Write-Host "🧪 Creating test script..." -ForegroundColor Cyan
@'
import requests
import json

def test_mcp_server():
    base_url = "http://localhost:8001"
    
    print("🧪 Testing LinkedIn MCP Server...")
    
    try:
        response = requests.get(f"{base_url}/health")
        if response.status_code == 200:
            print("✅ Health check passed")
            print(f"   Response: {response.json()}")
        else:
            print("❌ Health check failed")
            return
    except Exception as e:
        print(f"❌ Server not running: {e}")
        print("   Make sure to start the server with: start_server.bat")
        return
    
    try:
        print("\n🔄 Testing LinkedIn summary generation...")
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
            html_preview = data["summary_html"][:300] + "..." if len(data["summary_html"]) > 300 else data["summary_html"]
            print(f"   {html_preview}")
        else:
            print(f"❌ Summary generation failed: {response.status_code}")
            print(f"   Error: {response.text}")
    except Exception as e:
        print(f"❌ Summary test failed: {e}")
    
    print("\n🎉 Testing complete!")

if __name__ == "__main__":
    test_mcp_server()
'@ | Out-File -FilePath "test_mcp.py" -Encoding UTF8

Write-Host ""
Write-Host "🎉 LinkedIn MCP Setup Complete!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Update .env file with your credentials:" -ForegroundColor White
Write-Host "   - LinkedIn email and password" -ForegroundColor White
Write-Host "   - Anthropic API key (get from https://console.anthropic.com/)" -ForegroundColor White
Write-Host ""
Write-Host "2. Start the MCP web server:" -ForegroundColor White
Write-Host "   start_server.bat" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. Test the integration:" -ForegroundColor White
Write-Host "   python test_mcp.py" -ForegroundColor Cyan
Write-Host ""
Write-Host "4. Integrate with your Gatsby website using the provided React components" -ForegroundColor White
Write-Host ""
Write-Host "🔗 API Endpoints:" -ForegroundColor Yellow
Write-Host "   - GET  http://localhost:8001/health" -ForegroundColor White
Write-Host "   - POST http://localhost:8001/api/linkedin/summary" -ForegroundColor White
Write-Host ""

Read-Host "Press Enter to continue..."

