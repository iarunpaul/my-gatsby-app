// src/utils/fetchGitHubActivity.js

/**
 * Fetch GitHub user activity and statistics
 * Uses GitHub's public API - no authentication required for public data
 */

const GITHUB_API_BASE = 'https://api.github.com';

/**
 * Get GitHub user profile and basic stats
 */
export const fetchGitHubProfile = async (username) => {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/users/${username}`);

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const profile = await response.json();

    return {
      id: profile.id,
      login: profile.login,
      name: profile.name,
      avatar_url: profile.avatar_url,
      bio: profile.bio,
      blog: profile.blog,
      location: profile.location,
      company: profile.company,
      public_repos: profile.public_repos,
      public_gists: profile.public_gists,
      followers: profile.followers,
      following: profile.following,
      created_at: profile.created_at,
      updated_at: profile.updated_at,
      html_url: profile.html_url
    };
  } catch (error) {
    console.error('Error fetching GitHub profile:', error);
    throw error;
  }
};

/**
 * Get user's repositories with sorting and filtering
 */
export const fetchGitHubRepositories = async (username, options = {}) => {
  try {
    const {
      sort = 'updated',
      direction = 'desc',
      per_page = 10,
      type = 'owner'
    } = options;

    const params = new URLSearchParams({
      sort,
      direction,
      per_page: per_page.toString(),
      type
    });

    const response = await fetch(`${GITHUB_API_BASE}/users/${username}/repos?${params}`);

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const repos = await response.json();

    return repos.map(repo => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      description: repo.description,
      html_url: repo.html_url,
      clone_url: repo.clone_url,
      homepage: repo.homepage,
      language: repo.language,
      stargazers_count: repo.stargazers_count,
      watchers_count: repo.watchers_count,
      forks_count: repo.forks_count,
      open_issues_count: repo.open_issues_count,
      created_at: repo.created_at,
      updated_at: repo.updated_at,
      pushed_at: repo.pushed_at,
      topics: repo.topics || [],
      archived: repo.archived,
      fork: repo.fork,
      private: repo.private,
      size: repo.size
    }));
  } catch (error) {
    console.error('Error fetching GitHub repositories:', error);
    throw error;
  }
};

/**
 * Get user's recent activity events
 */
export const fetchGitHubEvents = async (username, limit = 10) => {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/users/${username}/events/public?per_page=${limit}`);

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const events = await response.json();

    return events.map(event => ({
      id: event.id,
      type: event.type,
      actor: event.actor,
      repo: event.repo,
      payload: event.payload,
      created_at: event.created_at,
      public: event.public
    }));
  } catch (error) {
    console.error('Error fetching GitHub events:', error);
    throw error;
  }
};

/**
 * Get repository languages for a user
 */
export const fetchGitHubLanguages = async (username, repoLimit = 20) => {
  try {
    // Get user's repositories first
    const repos = await fetchGitHubRepositories(username, {
      per_page: repoLimit,
      type: 'owner'
    });

    const languageStats = {};

    // Fetch languages for each repository
    for (const repo of repos) {
      if (repo.fork || repo.archived) continue; // Skip forks and archived repos

      try {
        const response = await fetch(`${GITHUB_API_BASE}/repos/${repo.full_name}/languages`);

        if (response.ok) {
          const languages = await response.json();

          // Aggregate language statistics
          Object.entries(languages).forEach(([language, bytes]) => {
            if (languageStats[language]) {
              languageStats[language] += bytes;
            } else {
              languageStats[language] = bytes;
            }
          });
        }
      } catch (langError) {
        console.warn(`Failed to fetch languages for ${repo.name}:`, langError);
      }

      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Calculate percentages and sort
    const totalBytes = Object.values(languageStats).reduce((sum, bytes) => sum + bytes, 0);

    const languagePercentages = Object.entries(languageStats)
      .map(([language, bytes]) => ({
        language,
        bytes,
        percentage: ((bytes / totalBytes) * 100).toFixed(1)
      }))
      .sort((a, b) => b.bytes - a.bytes);

    return languagePercentages;
  } catch (error) {
    console.error('Error fetching GitHub languages:', error);
    throw error;
  }
};

/**
 * Get contribution activity (commit activity)
 */
export const fetchGitHubContributions = async (username) => {
  try {
    // Note: GitHub's contributions API requires authentication for detailed stats
    // We'll get basic activity from events instead
    const events = await fetchGitHubEvents(username, 100);

    const pushEvents = events.filter(event => event.type === 'PushEvent');
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));

    const recentCommits = pushEvents.filter(event =>
      new Date(event.created_at) >= thirtyDaysAgo
    );

    const commitStats = {
      total_commits_last_30_days: recentCommits.reduce((sum, event) =>
        sum + (event.payload.commits?.length || 0), 0
      ),
      active_days_last_30_days: new Set(
        recentCommits.map(event =>
          new Date(event.created_at).toDateString()
        )
      ).size,
      repositories_contributed: new Set(
        recentCommits.map(event => event.repo.name)
      ).size
    };

    return commitStats;
  } catch (error) {
    console.error('Error fetching GitHub contributions:', error);
    throw error;
  }
};

/**
 * Format GitHub event for display
 */
export const formatGitHubEvent = (event) => {
  const { type, repo, payload, created_at } = event;
  const repoName = repo.name;
  const timeAgo = formatTimeAgo(created_at);

  switch (type) {
    case 'PushEvent':
      const commitCount = payload.commits?.length || 0;
      return {
        type: 'push',
        icon: '📝',
        title: `Pushed ${commitCount} commit${commitCount !== 1 ? 's' : ''}`,
        description: `to ${repoName}`,
        time: timeAgo,
        url: `https://github.com/${repo.name}`
      };

    case 'CreateEvent':
      return {
        type: 'create',
        icon: '🆕',
        title: `Created ${payload.ref_type}`,
        description: payload.ref_type === 'repository' ? repoName : `${payload.ref} in ${repoName}`,
        time: timeAgo,
        url: `https://github.com/${repo.name}`
      };

    case 'IssuesEvent':
      return {
        type: 'issue',
        icon: payload.action === 'opened' ? '🐛' : '✅',
        title: `${payload.action} issue`,
        description: `"${payload.issue.title}" in ${repoName}`,
        time: timeAgo,
        url: payload.issue.html_url
      };

    case 'PullRequestEvent':
      return {
        type: 'pr',
        icon: payload.action === 'opened' ? '🔄' : '✅',
        title: `${payload.action} pull request`,
        description: `"${payload.pull_request.title}" in ${repoName}`,
        time: timeAgo,
        url: payload.pull_request.html_url
      };

    case 'WatchEvent':
      return {
        type: 'star',
        icon: '⭐',
        title: 'Starred repository',
        description: repoName,
        time: timeAgo,
        url: `https://github.com/${repo.name}`
      };

    case 'ForkEvent':
      return {
        type: 'fork',
        icon: '🍴',
        title: 'Forked repository',
        description: repoName,
        time: timeAgo,
        url: `https://github.com/${repo.name}`
      };

    default:
      return {
        type: 'other',
        icon: '📋',
        title: type.replace('Event', ''),
        description: repoName,
        time: timeAgo,
        url: `https://github.com/${repo.name}`
      };
  }
};

/**
 * Format time ago string
 */
export const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return date.toLocaleDateString();
};

/**
 * Get language color for visualization
 */
export const getLanguageColor = (language) => {
  const colors = {
    JavaScript: '#f1e05a',
    TypeScript: '#2b7489',
    Python: '#3572A5',
    Java: '#b07219',
    'C#': '#239120',
    'C++': '#f34b7d',
    C: '#555555',
    Go: '#00ADD8',
    Rust: '#dea584',
    PHP: '#4F5D95',
    Ruby: '#701516',
    Swift: '#ffac45',
    Kotlin: '#F18E33',
    Dart: '#00B4AB',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Shell: '#89e051',
    PowerShell: '#012456',
    Vue: '#4FC08D',
    React: '#61DAFB',
    Angular: '#DD0031'
  };

  return colors[language] || '#6b7280';
};

/**
 * Comprehensive GitHub activity fetch
 */
export const fetchGitHubActivity = async (username) => {
  try {
    console.log(`🐙 Fetching GitHub activity for ${username}...`);

    const [profile, repositories, events, languages, contributions] = await Promise.all([
      fetchGitHubProfile(username),
      fetchGitHubRepositories(username, { per_page: 6 }),
      fetchGitHubEvents(username, 10),
      fetchGitHubLanguages(username, 15),
      fetchGitHubContributions(username)
    ]);

    const formattedEvents = events.map(formatGitHubEvent);

    console.log(`✅ Successfully fetched GitHub data for ${username}`);

    return {
      profile,
      repositories,
      recent_activity: formattedEvents,
      languages,
      contributions,
      fetched_at: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching comprehensive GitHub activity:', error);
    throw error;
  }
};