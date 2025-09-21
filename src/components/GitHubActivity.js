import React, { useState, useEffect } from 'react';
import {
  fetchGitHubActivity,
  getLanguageColor,
  formatTimeAgo
} from '../utils/fetchGitHubActivity';

const GitHubActivity = ({ username, className = '' }) => {
  const [gitHubData, setGitHubData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const loadGitHubData = async () => {
      if (!username) {
        setError('GitHub username not provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const data = await fetchGitHubActivity(username);
        setGitHubData(data);
      } catch (err) {
        console.error('Error loading GitHub data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadGitHubData();
  }, [username]);

  const handleRetry = () => {
    setGitHubData(null);
    setError(null);
    const loadGitHubData = async () => {
      try {
        setLoading(true);
        const data = await fetchGitHubActivity(username);
        setGitHubData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadGitHubData();
  };

  if (loading) {
    return (
      <div className={`github-activity-loading ${className}`}>
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-700"></div>
          <span className="ml-3 text-gray-600">Loading GitHub activity...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`github-activity-error bg-red-50 border border-red-200 rounded-lg p-6 ${className}`}>
        <div className="flex items-center">
          <div className="text-red-500 text-xl mr-3">⚠️</div>
          <div>
            <h3 className="text-red-800 font-semibold">Failed to Load GitHub Activity</h3>
            <p className="text-red-600 text-sm mt-1">{error}</p>
            <button
              onClick={handleRetry}
              className="mt-3 bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!gitHubData) {
    return (
      <div className={`github-activity-empty bg-gray-50 border border-gray-200 rounded-lg p-6 text-center ${className}`}>
        <div className="text-gray-400 text-4xl mb-3">🐙</div>
        <h3 className="text-gray-700 font-semibold">No GitHub Data Found</h3>
        <p className="text-gray-500 text-sm mt-1">Check the username and try again!</p>
      </div>
    );
  }

  const { profile, repositories, recent_activity, languages, contributions } = gitHubData;

  const ProfileStats = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-lg border p-4 text-center">
        <div className="text-2xl font-bold text-gray-900">{profile.public_repos}</div>
        <div className="text-sm text-gray-600">Public Repos</div>
      </div>
      <div className="bg-white rounded-lg border p-4 text-center">
        <div className="text-2xl font-bold text-gray-900">{profile.followers}</div>
        <div className="text-sm text-gray-600">Followers</div>
      </div>
      <div className="bg-white rounded-lg border p-4 text-center">
        <div className="text-2xl font-bold text-gray-900">{profile.following}</div>
        <div className="text-sm text-gray-600">Following</div>
      </div>
      <div className="bg-white rounded-lg border p-4 text-center">
        <div className="text-2xl font-bold text-gray-900">{contributions.total_commits_last_30_days}</div>
        <div className="text-sm text-gray-600">Commits (30d)</div>
      </div>
    </div>
  );

  const RepositoriesList = () => (
    <div className="space-y-4">
      {repositories.slice(0, 6).map((repo) => (
        <div key={repo.id} className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-semibold text-blue-600 hover:text-blue-800"
                >
                  {repo.name}
                </a>
                {repo.fork && (
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    Fork
                  </span>
                )}
                {repo.archived && (
                  <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded">
                    Archived
                  </span>
                )}
              </div>

              {repo.description && (
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                  {repo.description}
                </p>
              )}

              <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                {repo.language && (
                  <div className="flex items-center space-x-1">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getLanguageColor(repo.language) }}
                    ></div>
                    <span>{repo.language}</span>
                  </div>
                )}

                {repo.stargazers_count > 0 && (
                  <div className="flex items-center space-x-1">
                    <span>⭐</span>
                    <span>{repo.stargazers_count}</span>
                  </div>
                )}

                {repo.forks_count > 0 && (
                  <div className="flex items-center space-x-1">
                    <span>🍴</span>
                    <span>{repo.forks_count}</span>
                  </div>
                )}

                <span>Updated {formatTimeAgo(repo.updated_at)}</span>
              </div>

              {repo.topics && repo.topics.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {repo.topics.slice(0, 3).map((topic) => (
                    <span
                      key={topic}
                      className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                    >
                      {topic}
                    </span>
                  ))}
                  {repo.topics.length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{repo.topics.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const RecentActivity = () => (
    <div className="space-y-3">
      {recent_activity.slice(0, 8).map((activity, index) => (
        <div key={index} className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow">
          <div className="flex items-start space-x-3">
            <div className="text-xl">{activity.icon}</div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-gray-900">{activity.title}</span>
                  {activity.url ? (
                    <a
                      href={activity.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 ml-2"
                    >
                      {activity.description}
                    </a>
                  ) : (
                    <span className="text-gray-600 ml-2">{activity.description}</span>
                  )}
                </div>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const LanguagesChart = () => (
    <div className="bg-white rounded-lg border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Languages</h3>
      <div className="space-y-3">
        {languages.slice(0, 8).map((lang) => (
          <div key={lang.language} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: getLanguageColor(lang.language) }}
              ></div>
              <span className="text-sm font-medium text-gray-900">{lang.language}</span>
            </div>
            <span className="text-sm text-gray-600">{lang.percentage}%</span>
          </div>
        ))}
      </div>

      {/* Language bar chart */}
      <div className="mt-4">
        <div className="flex h-2 rounded overflow-hidden">
          {languages.slice(0, 5).map((lang, index) => (
            <div
              key={lang.language}
              className="h-full"
              style={{
                backgroundColor: getLanguageColor(lang.language),
                width: `${lang.percentage}%`
              }}
              title={`${lang.language}: ${lang.percentage}%`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );

  const ContributionStats = () => (
    <div className="bg-white rounded-lg border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity Stats</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Commits (Last 30 days)</span>
          <span className="font-semibold text-gray-900">{contributions.total_commits_last_30_days}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Active Days</span>
          <span className="font-semibold text-gray-900">{contributions.active_days_last_30_days}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Repositories Contributed</span>
          <span className="font-semibold text-gray-900">{contributions.repositories_contributed}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`github-activity ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <img
            src={profile.avatar_url}
            alt={profile.name || profile.login}
            className="w-16 h-16 rounded-full"
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
              <span>🐙 GitHub Activity</span>
            </h2>
            <div className="flex items-center space-x-2 text-gray-600">
              <a
                href={profile.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-800"
              >
                @{profile.login}
              </a>
              {profile.name && profile.name !== profile.login && (
                <span>• {profile.name}</span>
              )}
            </div>
            {profile.bio && (
              <p className="text-sm text-gray-600 mt-1">{profile.bio}</p>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <ProfileStats />

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'repositories', label: 'Repositories', icon: '📁' },
            { id: 'activity', label: 'Recent Activity', icon: '⚡' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LanguagesChart />
            <ContributionStats />
          </div>
        )}

        {activeTab === 'repositories' && <RepositoriesList />}

        {activeTab === 'activity' && <RecentActivity />}
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <a
          href={profile.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-800 text-sm"
        >
          <span>View full profile on GitHub</span>
          <span>→</span>
        </a>
      </div>

      {/* Styles */}
      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .github-activity {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        @media (max-width: 768px) {
          .grid-cols-4 {
            grid-template-columns: repeat(2, 1fr);
          }

          .lg\\:grid-cols-2 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default GitHubActivity;