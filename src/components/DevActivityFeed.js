// src/components/DevActivityFeed.js
// Unified GitHub + Azure DevOps activity feed.
// GitHub: always shown (public API, no auth).
// Azure DevOps: shown when GATSBY_AZURE_DEVOPS_ORG + GATSBY_AZURE_DEVOPS_PAT are set.

import React, { useState, useEffect } from 'react';
import { fetchGitHubEvents, fetchGitHubProfile, formatGitHubEvent, formatTimeAgo } from '../utils/fetchGitHubActivity';
import { fetchADOActivity } from '../utils/fetchAzureDevOps';

const SOURCE_GITHUB = 'github';
const SOURCE_ADO = 'ado';

const GitHubBadge = () => (
  <span className="inline-flex items-center gap-1 text-xs font-medium bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
    GitHub
  </span>
);

const ADOBadge = () => (
  <span className="inline-flex items-center gap-1 text-xs font-medium bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
      <path d="M0 12.267L2.99 7.67l7.174-4.44L13.184 0l2.978 2.302v4.21l5.838 1.578V18.74l-6.457 1.983-7.64-3.09-.152 3.09-4.254-.578L0 12.267zm13.168 5.48l4.816-1.496V9.845l-4.816 1.344v6.558zM3.142 11.97l3.388 4.198 5.12 1.874V10.26L8.228 8.968l-5.086 3.002z"/>
    </svg>
    Azure DevOps
  </span>
);

const ActivityItem = ({ item }) => (
  <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
    <span className="text-lg mt-0.5 flex-shrink-0">{item.icon}</span>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 flex-wrap">
        {item.source === SOURCE_GITHUB ? <GitHubBadge /> : <ADOBadge />}
        <span className="text-xs text-gray-400">{formatTimeAgo(item.time)}</span>
      </div>
      <p className="text-sm font-medium text-gray-800 mt-0.5 truncate">{item.title}</p>
      {item.subtitle && (
        <p className="text-xs text-gray-500 truncate">{item.subtitle}</p>
      )}
      {item.url && (
        <a href={item.url} target="_blank" rel="noopener noreferrer"
          className="text-xs text-blue-500 hover:text-blue-700 hover:underline mt-0.5 inline-block truncate max-w-full">
          {item.description || 'View →'}
        </a>
      )}
    </div>
  </div>
);

const ADOSetupPrompt = () => (
  <div className="rounded-lg border border-dashed border-blue-200 bg-blue-50/50 p-4 text-center">
    <svg className="w-8 h-8 text-blue-400 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
      <path d="M0 12.267L2.99 7.67l7.174-4.44L13.184 0l2.978 2.302v4.21l5.838 1.578V18.74l-6.457 1.983-7.64-3.09-.152 3.09-4.254-.578L0 12.267z"/>
    </svg>
    <p className="text-sm font-medium text-blue-700 mb-1">Azure DevOps not connected</p>
    <p className="text-xs text-blue-500 leading-relaxed">
      Add <code className="bg-blue-100 px-1 rounded">GATSBY_AZURE_DEVOPS_ORG</code> and{' '}
      <code className="bg-blue-100 px-1 rounded">GATSBY_AZURE_DEVOPS_PAT</code> to your{' '}
      <code className="bg-blue-100 px-1 rounded">.env.local</code> to see your ADO activity here.
    </p>
  </div>
);

const TABS = [
  { id: 'all', label: 'All' },
  { id: SOURCE_GITHUB, label: 'GitHub' },
  { id: SOURCE_ADO, label: 'Azure DevOps' },
];

const DevActivityFeed = ({ githubUsername = 'iarunpaul' }) => {
  const [ghItems, setGhItems] = useState([]);
  const [adoItems, setAdoItems] = useState([]);
  const [profile, setProfile] = useState(null);
  const [adoProjects, setAdoProjects] = useState(null);
  const [ghLoading, setGhLoading] = useState(true);
  const [adoLoading, setAdoLoading] = useState(false);
  const [adoError, setAdoError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  const ADO_ORG = process.env.GATSBY_AZURE_DEVOPS_ORG;
  const ADO_PAT = process.env.GATSBY_AZURE_DEVOPS_PAT;
  const adoConfigured = !!(ADO_ORG && ADO_PAT);

  // Load GitHub
  useEffect(() => {
    const load = async () => {
      try {
        const [events, prof] = await Promise.all([
          fetchGitHubEvents(githubUsername, 20),
          fetchGitHubProfile(githubUsername),
        ]);
        setProfile(prof);
        setGhItems(
          events.map((e) => {
            const fmt = formatGitHubEvent(e);
            return {
              ...fmt,
              source: SOURCE_GITHUB,
              time: e.created_at,
              subtitle: e.repo?.name,
            };
          })
        );
      } catch (e) {
        console.error('GitHub fetch error:', e);
      } finally {
        setGhLoading(false);
      }
    };
    load();
  }, [githubUsername]);

  // Load Azure DevOps
  useEffect(() => {
    if (!adoConfigured) return;
    const load = async () => {
      setAdoLoading(true);
      try {
        const data = await fetchADOActivity(ADO_ORG, ADO_PAT);
        setAdoProjects(data.projects);
        const combined = [
          ...data.commits.map((c) => ({ ...c, description: 'View commit →' })),
          ...data.builds.map((b) => ({ ...b, description: 'View build →' })),
        ].sort((a, b) => new Date(b.time) - new Date(a.time));
        setAdoItems(combined);
      } catch (e) {
        setAdoError(e.message);
      } finally {
        setAdoLoading(false);
      }
    };
    load();
  }, [ADO_ORG, ADO_PAT, adoConfigured]);

  const allItems = [...ghItems, ...adoItems].sort(
    (a, b) => new Date(b.time) - new Date(a.time)
  );

  const visibleItems =
    activeTab === 'all'
      ? allItems
      : activeTab === SOURCE_GITHUB
      ? ghItems
      : adoItems;

  const loading = ghLoading || adoLoading;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {profile?.avatar_url && (
              <img src={profile.avatar_url} alt={profile.login}
                className="w-9 h-9 rounded-full ring-2 ring-gray-100" />
            )}
            <div>
              <h3 className="text-base font-semibold text-gray-900">Developer Activity</h3>
              <p className="text-xs text-gray-500">
                {loading ? 'Loading…' : `${allItems.length} recent events`}
                {adoConfigured && adoProjects != null && ` · ${adoProjects} ADO projects`}
              </p>
            </div>
          </div>
          <div className="flex gap-1.5">
            <GitHubBadge />
            {adoConfigured && !adoError && <ADOBadge />}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-3">
          {TABS.filter((t) => t.id !== SOURCE_ADO || adoConfigured).map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
              }`}>
              {tab.label}
              {tab.id === 'all' && allItems.length > 0 && (
                <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${
                  activeTab === 'all' ? 'bg-white/20' : 'bg-gray-200 text-gray-600'
                }`}>{allItems.length}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="px-5 py-2 max-h-96 overflow-y-auto">
        {loading && visibleItems.length === 0 && (
          <div className="py-8 text-center">
            <div className="animate-spin w-6 h-6 border-2 border-gray-300 border-t-gray-800 rounded-full mx-auto mb-2" />
            <p className="text-sm text-gray-500">Fetching activity…</p>
          </div>
        )}

        {!loading && visibleItems.length === 0 && activeTab === SOURCE_ADO && !adoConfigured && (
          <div className="py-3"><ADOSetupPrompt /></div>
        )}

        {!loading && visibleItems.length === 0 && (activeTab !== SOURCE_ADO || adoConfigured) && (
          <p className="py-8 text-center text-sm text-gray-400">No activity found.</p>
        )}

        {visibleItems.map((item, i) => (
          <ActivityItem key={`${item.source}-${item.id || i}`} item={item} />
        ))}

        {!adoConfigured && activeTab === 'all' && !loading && (
          <div className="pt-3 pb-2"><ADOSetupPrompt /></div>
        )}

        {adoError && (
          <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-100">
            <p className="text-xs text-red-700 font-medium">Azure DevOps error</p>
            <p className="text-xs text-red-500 mt-0.5">{adoError}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
        <a href={`https://github.com/${githubUsername}`} target="_blank" rel="noopener noreferrer"
          className="text-xs text-gray-500 hover:text-gray-800 transition-colors flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          github.com/{githubUsername}
        </a>
        {adoConfigured && ADO_ORG && (
          <a href={`https://dev.azure.com/${ADO_ORG}`} target="_blank" rel="noopener noreferrer"
            className="text-xs text-gray-500 hover:text-gray-800 transition-colors flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M0 12.267L2.99 7.67l7.174-4.44L13.184 0l2.978 2.302v4.21l5.838 1.578V18.74l-6.457 1.983-7.64-3.09-.152 3.09-4.254-.578L0 12.267z"/>
            </svg>
            dev.azure.com/{ADO_ORG}
          </a>
        )}
      </div>
    </div>
  );
};

export default DevActivityFeed;
