import React, { useState, useRef } from "react";

const API =
  (typeof window !== "undefined" && window.__COPILOT_API__) ||
  process.env.GATSBY_COPILOT_API ||
  "http://localhost:8787";

export default function DemoPage() {
  const [keywords, setKeywords] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState([]);
  const outRef = useRef(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setJobs([]);
    try {
      const r = await fetch(`${API}/api/fetch_jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keywords, location, limit: 5 }),
      });
      const data = await r.json();
      setJobs(data?.results || []);
    } catch (err) {
      setJobs([]);
      if (outRef.current) outRef.current.textContent = "Error fetching jobs.";
    } finally {
      setLoading(false);
    }
  };

  const scoreJob = async (job) => {
    const resume = window.prompt("Paste resume text/markdown");
    if (!resume) return;

    const btn = document.activeElement;
    if (btn) {
      btn.disabled = true;
      btn.textContent = "Scoring...";
    }

    try {
      const r = await fetch(`${API}/api/score`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resume_markdown: resume,
          jobs: [job],
          method: "hybrid",
        }),
      });
      const data = await r.json();
      const s = data?.ranked?.[0]?.score;
      window.alert(
        "Match score: " + (s != null ? `${Math.round(s * 100)}%` : "n/a")
      );
    } catch (e) {
      window.alert("Error scoring: " + (e.message || e));
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = "Score vs My Resume";
      }
    }
  };

  return (
    <main
      style={{
        maxWidth: 720,
        margin: "24px auto",
        fontFamily: "system-ui",
        padding: 16,
      }}
    >
      <title>Career Copilot Demo</title>
      <h2 style={{ margin: "0 0 12px" }}>Career Copilot (Demo)</h2>

      <form id="f" onSubmit={onSubmit}>
        <input
          id="k"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder="keywords e.g. typescript, react"
          style={{ width: "60%", padding: 8 }}
        />
        <input
          id="loc"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="location e.g. Dublin"
          style={{ width: "35%", padding: 8, marginLeft: 8 }}
        />
        <button type="submit" style={{ marginLeft: 8, padding: "8px 12px" }}>
          Search
        </button>
      </form>

      <div id="out" ref={outRef} style={{ marginTop: 16 }}>
        {loading ? (
          "Loading..."
        ) : jobs.length === 0 ? (
          "No jobs."
        ) : (
          jobs.map((j) => (
            <div
              key={j.id}
              style={{
                padding: 10,
                border: "1px solid #ddd",
                borderRadius: 8,
                marginBottom: 8,
              }}
            >
              <div>
                <strong>{j.title}</strong> — {j.company || ""}
              </div>
              <div style={{ color: "#666" }}>
                {j.location || ""} • <em>{j.source}</em>
              </div>
              <div style={{ marginTop: 6 }}>
                <button
                  className="score"
                  type="button"
                  onClick={() => scoreJob(j)}
                >
                  Score vs My Resume
                </button>
                {j.url ? (
                  <a
                    href={j.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{ marginLeft: 8 }}
                  >
                    View
                  </a>
                ) : null}
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
