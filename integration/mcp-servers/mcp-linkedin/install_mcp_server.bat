@echo off
echo Installing LinkedIn MCP Server with Claude Integration
echo ====================================================

cd /d "C:\Users\ArunPaul(Polly)\source\repos\my-gatsby-site\mcp-servers\mcp-linkedin"

echo Current directory: %CD%

echo.
echo Step 1: Installing Python dependencies...
pip install fastapi uvicorn python-dotenv pydantic requests anthropic beautifulsoup4

echo.
echo Step 2: Installing MCP SDK (from GitHub)...
REM Note: MCP is still in development, so we'll install a compatible version
pip install mcp

echo.
echo Step 3: Installing additional dependencies...
pip install aiohttp structlog

echo.
echo Step 4: Verifying installation...
python -c "import fastapi, anthropic, mcp; print('✅ All core dependencies installed successfully')"

echo.
echo Step 5: Backing up old web_server.py...
if exist web_server.py (
    copy web_server.py web_server_backup.py
    echo ✅ Backed up existing web_server.py
)

echo.
echo Step 6: Ready to replace web_server.py with MCP version
echo.
echo Next steps:
echo 1. Replace web_server.py with the new MCP version
echo 2. Update your .env file with ANTHROPIC_API_KEY
echo 3. Test the server: python web_server.py
echo 4. Test MCP endpoints: python test_mcp.py
echo.
echo New MCP endpoints available:
echo - GET  /api/mcp/status
echo - POST /api/mcp/connect  
echo - GET  /api/linkedin/profile/{username}
echo - GET  /api/linkedin/posts/{username}
echo - POST /api/linkedin/summary (enhanced with MCP)
echo.

pause

