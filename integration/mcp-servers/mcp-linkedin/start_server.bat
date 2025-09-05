@echo off
echo Starting LinkedIn MCP Web Server...
echo ======================================

if not exist "web_server.py" (
    echo web_server.py not found in current directory
    echo Please run this script from the mcp-linkedin directory
    pause
    exit /b 1
)

if not exist ".env" (
    echo .env file not found
    echo Please create .env file with your credentials
)

echo Server will start on: http://localhost:8001
echo Available endpoints:
echo - GET  /health
echo - POST /api/linkedin/summary
echo - POST /api/linkedin/feed
echo.
echo Starting server... (Press Ctrl+C to stop)
echo.

python web_server.py
pause
