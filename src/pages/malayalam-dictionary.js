import React, { useState, useEffect, useRef, useCallback } from "react";

const API_URL =
  (typeof window !== "undefined" && window.__DICT_API__) ||
  process.env.GATSBY_DICT_API ||
  "https://malayalam-dictionary-prod-api.happycoast-dd452638.eastus2.azurecontainerapps.io";

const ML_FONT = "'Noto Sans Malayalam', serif";

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// Load Noto Sans Malayalam from Google Fonts
export function Head() {
  return (
    <>
      <title>Malayalam Smart Dictionary — AI-Powered English to Malayalam</title>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Noto+Sans+Malayalam:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />
    </>
  );
}

function MalayalamText({ text, size = "xl", weight = "medium", className = "" }) {
  const sizes = { sm: "text-base", md: "text-xl", xl: "text-2xl", "2xl": "text-3xl" };
  return (
    <span
      className={`${sizes[size]} font-${weight} text-amber-100 leading-relaxed ${className}`}
      style={{ fontFamily: ML_FONT }}
      lang="ml"
    >
      {text}
    </span>
  );
}

function ScoreBadge({ score }) {
  if (!score || score === 0) return null;
  const pct = Math.round(score * 100);
  const color = pct >= 85 ? "text-emerald-400" : pct >= 70 ? "text-amber-400" : "text-slate-400";
  return (
    <span className={`text-xs font-mono ${color} bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700`}>
      {pct}% match
    </span>
  );
}

function DefinitionList({ definitions, limit = 6 }) {
  const [expanded, setExpanded] = useState(false);
  if (!definitions?.length) return null;
  const shown = expanded ? definitions : definitions.slice(0, limit);
  const hasMore = definitions.length > limit;

  return (
    <div className="space-y-2 mt-3">
      {shown.map((d, i) => (
        <div key={d.id || i} className="flex gap-3 items-baseline group">
          <span className="text-slate-600 text-xs font-mono min-w-[1.4rem] text-right mt-1.5">
            {(d.orderIndex ?? i) + 1}.
          </span>
          <div className="flex-1">
            <MalayalamText text={d.malayalamText} size="xl" />
            {d.englishGloss && (
              <span className="text-slate-400 text-sm ml-2 italic">— {d.englishGloss}</span>
            )}
            {d.usageContext && (
              <span className="text-indigo-400 text-xs ml-2 bg-indigo-900/30 px-1.5 py-0.5 rounded">
                {d.usageContext}
              </span>
            )}
          </div>
        </div>
      ))}
      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-indigo-400 hover:text-indigo-300 mt-2 flex items-center gap-1 transition"
        >
          {expanded ? "Show fewer" : `Show ${definitions.length - limit} more meanings`}
          <span>{expanded ? "↑" : "↓"}</span>
        </button>
      )}
    </div>
  );
}

function ExactMatchCard({ entry }) {
  const defs = entry.malayalamDefinitions ?? [];
  const primaryDefs = defs.slice(0, 3);

  return (
    <div className="bg-slate-800/80 border border-indigo-700/40 rounded-2xl p-6 shadow-2xl ring-1 ring-indigo-500/10">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-5">
        <div>
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest">Exact match</span>
          <h2 className="text-3xl font-bold text-white mt-1 tracking-tight">{entry.englishWord}</h2>
          <div className="flex items-center gap-2 mt-1">
            {entry.partOfSpeech && entry.partOfSpeech !== "Unknown" && (
              <span className="text-xs text-slate-400 italic bg-slate-700/60 px-2 py-0.5 rounded">
                {entry.partOfSpeech.toLowerCase()}
              </span>
            )}
            {entry.source && (
              <span className="text-xs text-slate-500 bg-slate-700/40 px-2 py-0.5 rounded">
                {entry.source}
              </span>
            )}
          </div>
        </div>
        {/* Primary Malayalam meanings highlighted */}
        <div className="text-right space-y-1 max-w-[55%]">
          {primaryDefs.map((d, i) => (
            <div key={d.id || i}>
              <MalayalamText text={d.malayalamText} size="xl" weight="semibold" />
            </div>
          ))}
          {defs.length > 3 && (
            <span className="text-xs text-slate-500">+{defs.length - 3} more</span>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-700/60 my-4" />

      {/* All definitions */}
      <div>
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
          All meanings ({defs.length})
        </span>
        <DefinitionList definitions={defs} limit={6} />
      </div>

      {/* Synonyms */}
      {entry.synonyms?.length > 0 && (
        <div className="mt-5 pt-4 border-t border-slate-700/60">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-2">
            Related words
          </span>
          <div className="flex flex-wrap gap-2">
            {entry.synonyms.map((s, i) => (
              <button
                key={i}
                className="text-sm bg-slate-700 hover:bg-indigo-700/60 text-slate-300 hover:text-white px-3 py-1 rounded-full border border-slate-600 hover:border-indigo-500 transition"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Examples */}
      {entry.examples?.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-700/60 space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest block">Examples</span>
          {entry.examples.slice(0, 3).map((ex, i) => (
            <p key={i} className="text-sm text-slate-300 italic leading-relaxed">
              "{ex}"
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

function SemanticMatchCard({ entry, onClick, score }) {
  const defs = entry.malayalamDefinitions ?? [];

  return (
    <div
      className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 cursor-pointer hover:border-indigo-500/60 hover:bg-slate-800/80 transition group"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <span className="font-semibold text-white group-hover:text-indigo-300 transition text-lg leading-tight">
            {entry.englishWord}
          </span>
          {entry.partOfSpeech && entry.partOfSpeech !== "Unknown" && (
            <span className="text-xs text-slate-500 italic ml-2">{entry.partOfSpeech.toLowerCase()}</span>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <ScoreBadge score={score} />
          <span className="text-slate-600 text-xs">→</span>
        </div>
      </div>

      {/* Top 3 Malayalam meanings */}
      <div className="space-y-1">
        {defs.slice(0, 3).map((d, i) => (
          <div key={d.id || i} className="flex items-baseline gap-2">
            <span className="text-slate-600 text-xs min-w-[1rem]">{i + 1}.</span>
            <MalayalamText text={d.malayalamText} size="md" weight="normal" />
            {d.englishGloss && (
              <span className="text-slate-500 text-xs italic ml-1">{d.englishGloss}</span>
            )}
          </div>
        ))}
        {defs.length > 3 && (
          <span className="text-xs text-slate-600 ml-5">+{defs.length - 3} more</span>
        )}
      </div>
    </div>
  );
}

export default function MalayalamDictionaryPage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [apiStatus, setApiStatus] = useState("checking");
  const abortRef = useRef(null);
  const inputRef = useRef(null);

  const debouncedQuery = useDebounce(query, 400);

  // Poll health every 20s until online, then every 60s
  useEffect(() => {
    let alive = true;
    const check = () => {
      fetch(`${API_URL}/health`, { signal: AbortSignal.timeout(6000) })
        .then((r) => { if (alive) setApiStatus(r.ok ? "ok" : "down"); })
        .catch(() => { if (alive) setApiStatus("down"); });
    };
    check();
    const interval = setInterval(check, 20000);
    return () => { alive = false; clearInterval(interval); };
  }, []);

  const search = useCallback(async (word) => {
    const w = word.trim();
    if (!w) { setResult(null); setError(""); return; }
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch(`${API_URL}/api/v1/dictionary/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word: w, includeSemanticSearch: true }),
        signal: abortRef.current.signal,
      });
      if (res.status === 429) { setError("Too many requests — please slow down."); return; }
      if (!res.ok) { setError(`API error: ${res.status}`); return; }
      const json = await res.json();
      setResult(json.data ?? json);
    } catch (e) {
      if (e.name !== "AbortError")
        setError("Could not reach the API. It may be cold-starting — try again in a few seconds.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { search(debouncedQuery); }, [debouncedQuery, search]);

  const hasExact = result?.exactMatch != null;
  const semanticMatches = result?.semanticMatches ?? [];
  const hasResults = hasExact || semanticMatches.length > 0;

  const QUICK_WORDS = ["love", "freedom", "water", "knowledge", "river", "dream", "peace", "time"];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">

      {/* Header */}
      <div className="max-w-3xl mx-auto px-4 pt-12 pb-6">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center text-2xl flex-shrink-0">
            📖
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Malayalam Smart Dictionary
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">
              English → Malayalam · Semantic search · RAG-powered AI summaries
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-4">
          <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium
            ${apiStatus === "ok" ? "bg-emerald-900/50 text-emerald-300 border border-emerald-800/50" :
              apiStatus === "down" ? "bg-red-900/50 text-red-300 border border-red-800/50" :
              "bg-slate-800 text-slate-400 border border-slate-700"}`}>
            <span className={`w-1.5 h-1.5 rounded-full inline-block ${
              apiStatus === "ok" ? "bg-emerald-400 animate-pulse" :
              apiStatus === "down" ? "bg-red-400" : "bg-slate-500"}`} />
            {apiStatus === "ok" ? "API online" :
             apiStatus === "down" ? "API offline — warming up" : "Checking…"}
          </span>
          <span className="text-slate-500 text-xs">~58,000 words indexed</span>
          {result?.fromCache && (
            <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
              cached
            </span>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="max-w-3xl mx-auto px-4 mb-8">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type an English word…  e.g. love, freedom, water"
            autoFocus
            className="w-full bg-slate-800/80 border border-slate-600 rounded-2xl px-5 py-4 text-white text-lg placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition pr-14"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {loading && (
              <div className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
            )}
            {query && !loading && (
              <button
                onClick={() => { setQuery(""); setResult(null); inputRef.current?.focus(); }}
                className="text-slate-500 hover:text-slate-300 text-lg leading-none transition"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-3 text-sm text-amber-400 bg-amber-900/20 border border-amber-800/50 rounded-xl px-4 py-3">
            {error}
          </div>
        )}
      </div>

      {/* Results */}
      <div className="max-w-3xl mx-auto px-4 pb-20 space-y-6">

        {/* Exact match */}
        {hasExact && <ExactMatchCard entry={result.exactMatch} />}

        {/* AI Summary */}
        {result && hasResults && (
          <div className="bg-indigo-950/40 border border-indigo-800/40 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-base">✨</span>
              <span className="text-xs font-semibold text-indigo-300 uppercase tracking-widest">AI Context</span>
            </div>
            {result.aiGeneratedSummary ? (
              <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
                {result.aiGeneratedSummary}
              </p>
            ) : (
              <p className="text-slate-500 text-sm italic">
                AI context unavailable — Azure OpenAI may not be responding for this deployment.
              </p>
            )}
          </div>
        )}

        {/* Semantic matches */}
        {semanticMatches.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                Semantically similar words
              </h3>
              <span className="text-xs text-slate-600 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
                {semanticMatches.length}
              </span>
            </div>
            <div className="grid gap-3">
              {semanticMatches.map((m) => (
                <SemanticMatchCard
                  key={m.id}
                  entry={m}
                  score={m.confidenceScore}
                  onClick={() => setQuery(m.englishWord)}
                />
              ))}
            </div>
          </div>
        )}

        {/* No results */}
        {!loading && !error && result && !hasResults && (
          <div className="text-center py-16 text-slate-500">
            <span className="text-5xl block mb-4">🔍</span>
            <p className="text-lg">No results for <strong className="text-slate-300">"{query}"</strong></p>
            <p className="text-sm mt-2">Try a different spelling or a synonym.</p>
          </div>
        )}

        {/* Initial state */}
        {!query && !loading && !result && (
          <div className="text-center py-12 text-slate-500">
            <div className="text-5xl mb-4" style={{ fontFamily: ML_FONT }}>
              മലയാളം
            </div>
            <p className="text-sm mb-6">Start typing to explore ~58,000 English → Malayalam entries</p>
            <div className="flex flex-wrap justify-center gap-2">
              {QUICK_WORDS.map((w) => (
                <button
                  key={w}
                  onClick={() => setQuery(w)}
                  className="text-sm bg-slate-800/80 hover:bg-indigo-900/50 text-slate-400 hover:text-indigo-300 px-4 py-2 rounded-full border border-slate-700 hover:border-indigo-600 transition"
                >
                  {w}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-800/80 text-center py-6 text-slate-600 text-xs">
        <p>
          Powered by{" "}
          <a href="https://github.com/iarunpaul/MalayalamEnglishSmartDictionary"
            className="hover:text-indigo-400 transition" target="_blank" rel="noreferrer">
            MalayalamEnglishSmartDictionary
          </a>{" "}
          · Data from{" "}
          <a href="https://olam.in" className="hover:text-indigo-400 transition" target="_blank" rel="noreferrer">
            Olam
          </a>{" "}
          · Embeddings via Azure OpenAI text-embedding-3-small
        </p>
      </div>
    </main>
  );
}
