// src/components/linkedin/LinkedInMCPSummary.js
// React component for displaying AI-generated LinkedIn activity summary

import React, { useState, useEffect } from 'react';

const LinkedInMCPSummary = ({ 
  username = "arun-paul-polly-741042b9", 
  autoRefresh = true, 
  refreshInterval = 300000, // 5 minutes
  className = "" 
}) => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Enhanced LinkedIn Server configuration - uses Azure server in production
  const GATSBY_API_BASE_URL = process.env.GATSBY_API_BASE_URL ||
    (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
      ? 'http://localhost:3001'
      : 'https://linkedin-career-server.azurewebsites.net');

  const fetchLinkedInSummary = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${GATSBY_API_BASE_URL}/api/linkedin/summary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          include_metrics: true,
          include_themes: true,
          include_topics: true,
          max_posts: 10,
          apiKey: process.env.GATSBY_ANTHROPIC_API_KEY || (typeof window !== 'undefined' ? localStorage.getItem('anthropic_api_key') : null)
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setSummary(data);
        setLastUpdated(new Date());
      } else {
        throw new Error('Failed to generate LinkedIn summary');
      }

    } catch (err) {
      console.error('LinkedIn MCP Error:', err);
      setError(err.message);
      
      // Fallback to mock data for development
      if (process.env.NODE_ENV === 'development') {
        setSummary({
          success: true,
          summary_html: generateFallbackSummary(),
          raw_data: getMockData(),
          generated_at: new Date().toISOString()
        });
        setLastUpdated(new Date());
      }
    } finally {
      setLoading(false);
    }
  };

  // Fallback summary for development/demo
  const generateFallbackSummary = () => {
    return `
      <div class="linkedin-activity-summary">
        <div class="summary-header">
          <h3>Recent Professional Activity</h3>
          <p class="summary-subtitle">AI-generated insights from LinkedIn activity</p>
        </div>
        
        <div class="activity-highlights">
          <div class="highlight-section">
            <h4>🚀 Recent Posts & Themes</h4>
            <div class="post-themes">
              <div class="theme-item">
                <strong>Software Architecture:</strong> Shared insights on microservices patterns and enterprise application design, generating significant engagement with 45 likes and 8 thoughtful comments.
              </div>
              <div class="theme-item">
                <strong>Modern Web Development:</strong> Discussed Angular 18 features and Azure Functions integration, highlighting the evolution of reactive application development.
              </div>
              <div class="theme-item">
                <strong>DevOps & Cloud Native:</strong> Explored Kubernetes deployment strategies, comparing Blue-Green, Rolling, and Canary approaches for modern workflows.
              </div>
            </div>
          </div>

          <div class="engagement-metrics">
            <h4>📊 Engagement Metrics</h4>
            <div class="metrics-grid">
              <div class="metric-card">
                <div class="metric-value">301</div>
                <div class="metric-label">Total Engagement</div>
              </div>
              <div class="metric-card">
                <div class="metric-value">100.3</div>
                <div class="metric-label">Avg. per Post</div>
              </div>
              <div class="metric-card">
                <div class="metric-value">54</div>
                <div class="metric-label">Total Shares</div>
              </div>
            </div>
          </div>

          <div class="key-topics">
            <h4>💡 Key Discussion Topics</h4>
            <div class="topics-list">
              <span class="topic-tag">Software Architecture</span>
              <span class="topic-tag">Cloud Technologies</span>
              <span class="topic-tag">Web Development</span>
              <span class="topic-tag">DevOps</span>
              <span class="topic-tag">Microservices</span>
              <span class="topic-tag">Kubernetes</span>
            </div>
          </div>

          <div class="professional-insights">
            <h4>🎯 Professional Insights</h4>
            <p>Recent activity demonstrates strong thought leadership in enterprise software architecture and cloud-native technologies. Consistent engagement with the developer community through technical content sharing and architectural discussions. Focus areas include modern application patterns, deployment strategies, and emerging web technologies.</p>
          </div>
        </div>
      </div>
    `;
  };

  // Mock data for development
  const getMockData = () => ({
    recent_posts: [
      {
        content: "Microservices architecture insights...",
        engagement: { likes: 45, comments: 8, shares: 12 },
        themes: ["Software Architecture", "Microservices"]
      }
    ],
    profile_metrics: {
      total_engagement: 301,
      avg_engagement_per_post: 100.3
    }
  });

  // Auto-refresh functionality
  useEffect(() => {
    fetchLinkedInSummary();

    if (autoRefresh) {
      const interval = setInterval(fetchLinkedInSummary, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [username, autoRefresh, refreshInterval]);

  // Loading state
  if (loading) {
    return (
      <div className={`linkedin-mcp-summary loading ${className}`}>
        <div className="loading-header">
          <div className="loading-skeleton loading-title"></div>
          <div className="loading-skeleton loading-subtitle"></div>
        </div>
        <div className="loading-content">
          <div className="loading-skeleton loading-text"></div>
          <div className="loading-skeleton loading-text"></div>
          <div className="loading-skeleton loading-text short"></div>
        </div>
        <style jsx>{`
          .linkedin-mcp-summary.loading {
            padding: 24px;
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            border-radius: 12px;
            border: 1px solid #e2e8f0;
          }
          .loading-skeleton {
            background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
            background-size: 200% 100%;
            animation: loading 1.5s infinite;
            border-radius: 4px;
            margin-bottom: 12px;
          }
          .loading-title { height: 24px; width: 60%; }
          .loading-subtitle { height: 16px; width: 40%; }
          .loading-text { height: 16px; width: 100%; }
          .loading-text.short { width: 70%; }
          @keyframes loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}</style>
      </div>
    );
  }

  // Error state
  if (error && !summary) {
    return (
      <div className={`linkedin-mcp-summary error ${className}`}>
        <div className="error-content">
          <div className="error-icon">⚠️</div>
          <h3>Unable to Load LinkedIn Activity</h3>
          <p>There was an issue connecting to the LinkedIn MCP server.</p>
          <button 
            onClick={fetchLinkedInSummary}
            className="retry-button"
          >
            Try Again
          </button>
        </div>
        <style jsx>{`
          .linkedin-mcp-summary.error {
            padding: 32px;
            text-align: center;
            background: #fef2f2;
            border: 1px solid #fecaca;
            border-radius: 12px;
            color: #991b1b;
          }
          .error-icon { font-size: 48px; margin-bottom: 16px; }
          .error-content h3 { margin: 0 0 8px 0; color: #991b1b; }
          .error-content p { margin: 0 0 16px 0; color: #7f1d1d; }
          .retry-button {
            background: #dc2626;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 500;
          }
          .retry-button:hover { background: #b91c1c; }
        `}</style>
      </div>
    );
  }

  return (
    <div className={`linkedin-mcp-summary ${className}`}>
      {/* Header with refresh button */}
      <div className="summary-controls">
        <div className="summary-title">
          <h3>LinkedIn Professional Activity</h3>
          {lastUpdated && (
            <p className="last-updated">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
        <button 
          onClick={fetchLinkedInSummary}
          className="refresh-button"
          disabled={loading}
          title="Refresh LinkedIn summary"
        >
          🔄
        </button>
      </div>

      {/* AI-generated summary content */}
      <div 
        className="summary-content"
        dangerouslySetInnerHTML={{ 
          __html: summary?.summary_html || generateFallbackSummary() 
        }}
      />

      {/* Footer with MCP attribution */}
      <div className="summary-footer">
        <div className="mcp-attribution">
          <span className="ai-badge">🤖 AI-Generated</span>
          <span className="mcp-badge">Powered by MCP + Claude</span>
        </div>
        {error && (
          <div className="error-notice">
            ⚠️ Using cached data due to connection issue
          </div>
        )}
      </div>

      {/* Embedded styles */}
      <style jsx>{`
        .linkedin-mcp-summary {
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .summary-controls {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid #e2e8f0;
        }

        .summary-title h3 {
          margin: 0 0 4px 0;
          color: #1e293b;
          font-size: 20px;
          font-weight: 600;
        }

        .last-updated {
          margin: 0;
          color: #64748b;
          font-size: 12px;
        }

        .refresh-button {
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 8px 12px;
          cursor: pointer;
          font-size: 16px;
          transition: all 0.2s;
        }

        .refresh-button:hover:not(:disabled) {
          background: #2563eb;
          transform: scale(1.05);
        }

        .refresh-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .summary-content {
          line-height: 1.6;
          color: #374151;
        }

        /* Styles for AI-generated content */
        .summary-content :global(.linkedin-activity-summary) {
          font-family: inherit;
        }

        .summary-content :global(.summary-header h3) {
          color: #1e293b;
          font-size: 18px;
          margin: 0 0 8px 0;
        }

        .summary-content :global(.summary-subtitle) {
          color: #64748b;
          font-size: 14px;
          margin: 0 0 20px 0;
        }

        .summary-content :global(.highlight-section) {
          margin-bottom: 24px;
        }

        .summary-content :global(.highlight-section h4) {
          color: #1e293b;
          font-size: 16px;
          margin: 0 0 12px 0;
          font-weight: 600;
        }

        .summary-content :global(.theme-item) {
          margin-bottom: 12px;
          padding: 12px;
          background: #f8fafc;
          border-radius: 8px;
          border-left: 4px solid #3b82f6;
        }

        .summary-content :global(.theme-item strong) {
          color: #1e293b;
        }

        .summary-content :global(.metrics-grid) {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 16px;
          margin-top: 12px;
        }

        .summary-content :global(.metric-card) {
          text-align: center;
          padding: 16px;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          color: white;
          border-radius: 12px;
        }

        .summary-content :global(.metric-value) {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .summary-content :global(.metric-label) {
          font-size: 12px;
          opacity: 0.9;
        }

        .summary-content :global(.topics-list) {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 12px;
        }

        .summary-content :global(.topic-tag) {
          background: #e0e7ff;
          color: #3730a3;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
        }

        .summary-content :global(.professional-insights p) {
          background: #f0f9ff;
          padding: 16px;
          border-radius: 8px;
          border-left: 4px solid #0ea5e9;
          margin: 12px 0 0 0;
          font-style: italic;
        }

        .summary-footer {
          margin-top: 20px;
          padding-top: 16px;
          border-top: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
        }

        .mcp-attribution {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .ai-badge, .mcp-badge {
          font-size: 11px;
          padding: 4px 8px;
          border-radius: 12px;
          font-weight: 500;
        }

        .ai-badge {
          background: #dcfce7;
          color: #166534;
        }

        .mcp-badge {
          background: #e0e7ff;
          color: #3730a3;
        }

        .error-notice {
          font-size: 11px;
          color: #dc2626;
          background: #fef2f2;
          padding: 4px 8px;
          border-radius: 12px;
        }

        /* Responsive design */
        @media (max-width: 768px) {
          .linkedin-mcp-summary {
            padding: 16px;
          }

          .summary-controls {
            flex-direction: column;
            gap: 12px;
            align-items: stretch;
          }

          .refresh-button {
            align-self: flex-end;
            width: fit-content;
          }

          .summary-content :global(.metrics-grid) {
            grid-template-columns: 1fr;
          }

          .summary-footer {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
};

export default LinkedInMCPSummary;

