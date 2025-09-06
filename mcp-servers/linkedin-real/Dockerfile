# LinkedIn MCP Server Dockerfile - Fixed Version
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies including build tools
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    git \
    curl \
    build-essential \
    python3-dev \
    libffi-dev \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

# Upgrade pip and install wheel first
RUN pip install --no-cache-dir --upgrade pip setuptools wheel

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies with specific PyYAML version first
RUN pip install --no-cache-dir PyYAML==6.0.1 && \
    pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create non-root user for security
RUN useradd --create-home --shell /bin/bash app && \
    chown -R app:app /app
USER app

# Expose port
EXPOSE 8001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8001/health || exit 1

# Set environment variables
ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=1

# Run the application
CMD ["python", "web_server.py"]

