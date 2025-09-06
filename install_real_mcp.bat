@echo off
echo Installing Real LinkedIn MCP Server (adhikasp/mcp-linkedin)
echo ========================================================

set /p LINKEDIN_EMAIL="Enter your LinkedIn email: "
set /p LINKEDIN_PASSWORD="Enter your LinkedIn password: "

if "%LINKEDIN_EMAIL%"=="" (
    echo Error: LinkedIn email is required!
    pause
    exit /b 1
)

if "%LINKEDIN_PASSWORD%"=="" (
    echo Error: LinkedIn password is required!
    pause
    exit /b 1
)

echo.
echo Creating real LinkedIn MCP integration...

REM Navigate to project root
cd /d "C:\Users\ArunPaul(Polly)\source\repos\my-gatsby-site"

REM Create real MCP directory
echo Creating linkedin-real directory...
mkdir mcp-servers\linkedin-real 2>nul
cd mcp-servers\linkedin-real

echo Current directory: %CD%

echo.
echo Step 1: Installing real LinkedIn MCP server...
pip install git+https://github.com/adhikasp/mcp-linkedin

echo.
echo Step 2: Installing additional dependencies...
pip install fastapi uvicorn anthropic python-dotenv requests

echo.
echo Step 3: Creating environment configuration...
(
echo # Real LinkedIn MCP Server Configuration
echo LINKEDIN_EMAIL=%LINKEDIN_EMAIL%
echo LINKEDIN_PASSWORD=%LINKEDIN_PASSWORD%
echo.
echo # Claude AI Configuration
echo ANTHROPIC_API_KEY=your_anthropic_key_here
echo.
echo # Server Configuration
echo MCP_SERVER_PORT=8001
echo MCP_SERVER_HOST=0.0.0.0
echo.
echo # LinkedIn API Settings
echo LINKEDIN_HEADLESS=true
echo LINKEDIN_TIMEOUT=30
echo.
echo # Debug Settings
echo DEBUG=true
echo LOG_LEVEL=info
) > .env

echo ✅ Created .env file with LinkedIn credentials

echo.
echo Step 4: Testing MCP server installation...
python -c "
try:
    import mcp_linkedin
    print('✅ LinkedIn MCP server installed successfully')
except ImportError as e:
    print('❌ LinkedIn MCP server installation failed:', e)
"

echo.
echo Step 5: Verifying dependencies...
python -c "
import sys
required = ['fastapi', 'uvicorn', 'anthropic', 'requests']
missing = []
for pkg in required:
    try:
        __import__(pkg)
        print(f'✅ {pkg}')
    except ImportError:
        missing.append(pkg)
        print(f'❌ {pkg}')

if missing:
    print(f'Missing packages: {missing}')
    sys.exit(1)
else:
    print('✅ All dependencies verified')
"

echo.
echo 🎉 Real LinkedIn MCP Server Installation Complete!
echo.
echo Next Steps:
echo 1. Update ANTHROPIC_API_KEY in .env file
echo 2. Copy the real MCP web server code to web_server.py
echo 3. Start server: python web_server.py
echo 4. Test integration: python test_real_mcp.py
echo.
echo ⚠️  Important Security Notes:
echo - Your LinkedIn credentials are stored locally in .env
echo - Never commit .env file to Git
echo - Use at your own risk (unofficial LinkedIn API)
echo - Respect LinkedIn's Terms of Service
echo.
echo 🔗 Real LinkedIn MCP Features:
echo - ✅ Real LinkedIn feed posts
echo - ✅ Actual job search results  
echo - ✅ Live profile data
echo - ✅ Real engagement metrics
echo - ✅ Dynamic content updates
echo.
echo API Endpoints (Real Data):
echo - GET  /api/linkedin/feed
echo - GET  /api/linkedin/jobs?keywords=...&location=...
echo - POST /api/linkedin/summary
echo - POST /api/mcp/connect
echo.

REM Go back to project root
cd ..\..

echo Ready to integrate real LinkedIn data with your Gatsby website! 🚀
echo.

pause

