import React, { useState, useEffect, useRef, useCallback } from "react";

const API_URL =
  (typeof window !== "undefined" && window.__DICT_API__) ||
  process.env.GATSBY_DICT_API ||
  "https://malayalam-dictionary-prod-api.happycoast-dd452638.eastus2.azurecontainerapps.io";

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function MalayalamDictionaryPage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [apiStatus, setApiStatus] = useState("checking"); // "ok" | "down" | "checking"
  const abortRef = useRef(null);

  const debouncedQuery = useDebounce(query, 400);

  // Health-check on mount
  useEffect(() => {
    fetch(`${API_URL}/health`, { signal: AbortSignal.timeout(5000) })
      .then((r) => setApiStatus(r.ok ? "ok" : "down"))
      .catch(() => setApiStatus("down"));
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
      setResult(json.data || json);
    } catch (e) {
      if (e.name !== "AbortError") setError("Could not reach the dictionary API. It may be cold-starting — try again in a few seconds.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    search(debouncedQuery);
  }, [debouncedQuery, search]);

  const hasExact = result?.exactMatch != null;
  const hasSemanticMatches = result?.semanticMatches?.length > 0;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <title>Malayalam Dictionary — AI-Powered English→Malayalam</title>

      {/* Header */}
      <div className="max-w-3xl mx-auto px-4 pt-12 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">📖</span>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Malayalam Smart Dictionary
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">
              English → Malayalam · Semantic search · RAG-powered AI summaries
            </p>
          </div>
        </div>

        {/* API status badge */}
        <div className="flex items-center gap-2 mt-4">
          <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium
            ${apiStatus === "ok" ? "bg-emerald-900/60 text-emerald-300" :
              apiStatus === "down" ? "bg-red-900/60 text-red-300" :
              "bg-slate-700 text-slate-400"}`}>
            <span className={`w-1.5 h-1.5 rounded-full inline-block
              ${apiStatus === "ok" ? "bg-emerald-400 animate-pulse" :
                apiStatus === "down" ? "bg-red-400" : "bg-slate-500"}`}/>
            {apiStatus === "ok" ? "API online" :
             apiStatus === "down" ? "API offline (scale-to-zero — may take ~10s to warm up)" :
             "Checking API…"}
          </span>
          <span className="text-slate-500 text-xs">~58,000 words indexed</span>
        </div>
      </div>

      {/* Search box */}
      <div className="max-w-3xl mx-auto px-4 mb-8">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type an English word…  e.g. love, freedom, water"
            autoFocus
            className="w-full bg-slate-800 border border-slate-600 rounded-xl px-5 py-4 text-white text-lg placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition pr-12"
          />
          {loading && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"/>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-3 text-sm text-amber-400 bg-amber-900/30 border border-amber-800 rounded-lg px-4 py-3">
            {error}
          </div>
        )}
      </div>

      {/* Results */}
      <div className="max-w-3xl mx-auto px-4 pb-16 space-y-6">

        {/* Exact match */}
        {hasExact && (
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 shadow-xl">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest">Exact match</span>
                <h2 className="text-2xl font-bold text-white mt-1">
                  {result.exactMatch.englishWord}
                </h2>
                {result.exactMatch.partOfSpeech && result.exactMatch.partOfSpeech !== "Unknown" && (
                  <span className="text-xs text-slate-400 italic">{result.exactMatch.partOfSpeech}</span>
                )}
              </div>
              <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-md">
                {result.exactMatch.source}
              </span>
            </div>

            {/* Malayalam definitions */}
            <div className="space-y-2">
              {result.exactMatch.definitions?.map((d, i) => (
                <div key={d.id || i} className="flex gap-3">
                  <span className="text-slate-500 text-sm mt-0.5 min-w-[1.25rem]">{i + 1}.</span>
                  <span className="text-2xl leading-snug text-white font-medium" style={{ fontFamily: "serif" }}>
                    {d.malayalamText}
                    {d.englishGloss && (
                      <span className="text-slate-400 text-base font-normal ml-2">({d.englishGloss})</span>
                    )}
                  </span>
                </div>
              ))}
            </div>

            {/* Synonyms */}
            {result.exactMatch.synonyms?.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {result.exactMatch.synonyms.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setQuery(s)}
                    className="text-sm bg-slate-700 hover:bg-indigo-700 text-slate-300 hover:text-white px-3 py-1 rounded-full transition cursor-pointer"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Examples */}
            {result.exactMatch.examples?.length > 0 && (
              <div className="mt-4 border-t border-slate-700 pt-4 space-y-1">
                {result.exactMatch.examples.slice(0, 2).map((ex, i) => (
                  <p key={i} className="text-sm text-slate-300 italic">"{ex}"</p>
                ))}
              </div>
            )}
          </div>
        )}

        {/* AI Summary */}
        {result?.aiGeneratedSummary && (
          <div className="bg-indigo-900/30 border border-indigo-700/50 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">✨</span>
              <span className="text-xs font-semibold text-indigo-300 uppercase tracking-widest">AI Summary</span>
            </div>
            <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
              {result.aiGeneratedSummary}
            </p>
          </div>
        )}

        {/* Semantic matches */}
        {hasSemanticMatches && (
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
              Semantically similar words
            </h3>
            <div className="grid gap-3">
              {result.semanticMatches.map((m) => (
                <div
                  key={m.id}
                  className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 cursor-pointer hover:border-indigo-600 transition"
                  onClick={() => setQuery(m.englishWord)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && setQuery(m.englishWord)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-white">{m.englishWord}</span>
                    {m.partOfSpeech && m.partOfSpeech !== "Unknown" && (
                      <span className="text-xs text-slate-500 italic">{m.partOfSpeech}</span>
                    )}
                  </div>
                  <div className="text-slate-300 text-sm" style={{ fontFamily: "serif" }}>
                    {m.definitions?.slice(0, 2).map((d) => d.malayalamText).join(" · ")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && result && !hasExact && !hasSemanticMatches && (
          <div className="text-center py-12 text-slate-500">
            <span className="text-4xl block mb-3">🔍</span>
            <p>No results found for <strong className="text-slate-300">"{query}"</strong></p>
            <p className="text-sm mt-1">Try a different spelling or a related word.</p>
          </div>
        )}

        {/* Initial empty state */}
        {!query && !loading && !result && (
          <div className="text-center py-12 text-slate-500">
            <p className="text-sm">Start typing to search ~58,000 English→Malayalam entries</p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {["love", "freedom", "water", "sun", "knowledge", "river"].map((w) => (
                <button
                  key={w}
                  onClick={() => setQuery(w)}
                  className="text-sm bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white px-3 py-1.5 rounded-full border border-slate-700 hover:border-slate-600 transition"
                >
                  {w}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-800 text-center py-6 text-slate-600 text-xs">
        <p>
          Powered by{" "}
          <a
            href="https://github.com/iarunpaul/MalayalamEnglishSmartDictionary"
            className="text-slate-500 hover:text-indigo-400 transition"
            target="_blank"
            rel="noreferrer"
          >
            MalayalamEnglishSmartDictionary
          </a>{" "}
          · Data from{" "}
          <a href="https://olam.in" className="text-slate-500 hover:text-indigo-400 transition" target="_blank" rel="noreferrer">
            Olam
          </a>{" "}
          · Embeddings via Azure OpenAI text-embedding-3-small
        </p>
      </div>
    </main>
  );
}
