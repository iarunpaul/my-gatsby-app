// src/utils/fetchAzureDevOps.js
// Fetches recent commit and build activity from Azure DevOps REST API.
// Requires env vars:
//   GATSBY_AZURE_DEVOPS_ORG  — organisation slug, e.g. "iarunpaul0142"
//   GATSBY_AZURE_DEVOPS_PAT  — Personal Access Token (Code Read + Build Read scopes)

const ADO_BASE = 'https://dev.azure.com';

const adoHeaders = (pat) => ({
  Authorization: 'Basic ' + btoa(':' + pat),
  'Content-Type': 'application/json',
});

export const fetchADOActivity = async (org, pat) => {
  const h = adoHeaders(pat);

  // 1 — list projects
  const projRes = await fetch(`${ADO_BASE}/${org}/_apis/projects?api-version=7.1`, { headers: h });
  if (!projRes.ok) {
    throw new Error(
      `Azure DevOps responded with ${projRes.status}. Check your org name and PAT.`
    );
  }
  const { value: projects } = await projRes.json();

  const commits = [];
  const builds = [];

  // 2 — fetch commits + builds for up to 5 projects in parallel
  await Promise.all(
    projects.slice(0, 5).map(async (project) => {
      // Commits via Git repos
      try {
        const repoRes = await fetch(
          `${ADO_BASE}/${org}/${project.id}/_apis/git/repositories?api-version=7.1`,
          { headers: h }
        );
        if (repoRes.ok) {
          const { value: repos } = await repoRes.json();
          await Promise.all(
            repos.slice(0, 3).map(async (repo) => {
              const cRes = await fetch(
                `${ADO_BASE}/${org}/${project.id}/_apis/git/repositories/${repo.id}/commits?$top=5&api-version=7.1`,
                { headers: h }
              );
              if (!cRes.ok) return;
              const { value: repoCommits } = await cRes.json();
              (repoCommits || []).forEach((c) =>
                commits.push({
                  id: c.commitId,
                  source: 'ado',
                  type: 'commit',
                  icon: '📦',
                  title: (c.comment || 'commit').split('\n')[0].substring(0, 80),
                  subtitle: `${repo.name} · ${project.name}`,
                  time: c.author?.date,
                  url: `https://dev.azure.com/${org}/${project.name}/_git/${repo.name}/commit/${c.commitId}`,
                })
              );
            })
          );
        }
      } catch (_) { /* skip silently */ }

      // Completed builds
      try {
        const bRes = await fetch(
          `${ADO_BASE}/${org}/${project.name}/_apis/build/builds?$top=5&statusFilter=completed&api-version=7.1`,
          { headers: h }
        );
        if (!bRes.ok) return;
        const { value: projectBuilds } = await bRes.json();
        (projectBuilds || []).forEach((b) =>
          builds.push({
            id: String(b.id),
            source: 'ado',
            type: 'build',
            icon:
              b.result === 'succeeded'
                ? '✅'
                : b.result === 'failed'
                ? '❌'
                : '⚠️',
            title: b.definition?.name || 'Pipeline run',
            subtitle: `${b.result} · ${project.name}`,
            time: b.finishTime,
            url: b._links?.web?.href,
          })
        );
      } catch (_) { /* skip silently */ }
    })
  );

  return {
    projects: projects.length,
    commits: commits.sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 12),
    builds: builds.sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 8),
  };
};
