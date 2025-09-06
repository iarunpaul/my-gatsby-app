# LinkedIn MCP Server Dockerfile - Optimized for Real MCP Integration
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies for MCP and LinkedIn scraping
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    git \
    curl \
    build-essential \
    python3-dev \
    libffi-dev \
    libssl-dev \
    chromium \
    chromium-driver \
    && rm -rf /var/lib/apt/lists/*

# Set Chrome/Chromium environment variables for LinkedIn scraping
ENV CHROME_BIN=/usr/bin/chromium
ENV CHROME_PATH=/usr/bin/chromium

# Upgrade pip and install build tools
RUN pip install --no-cache-dir --upgrade pip setuptools wheel

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies in specific order to avoid conflicts
RUN pip install --no-cache-dir PyYAML==6.0.1 && \
    pip install --no-cache-dir pydantic==2.11.7 && \
    pip install --no-cache-dir fastapi==0.115.12 && \
    pip install --no-cache-dir anthropic==0.66.0 && \
    pip install --no-cache-dir httpx==0.28.1 && \
    pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create non-root user for security
RUN useradd --create-home --shell /bin/bash app && \
    chown -R app:app /app

# Switch to non-root user
USER app

# Expose ports (8001 for web server, 3000 for MCP server)
EXPOSE 8001 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8001/health || exit 1

# Set environment variables
ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=1
ENV MCP_SERVER_PORT=8001
ENV MCP_LINKEDIN_PORT=3000

# Run the application
CMD ["python", "web_server.py"]

