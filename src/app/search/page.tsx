"use client";

import { useState } from "react";

interface Source {
  id: string;
  title: string;
  topicDomain: string;
  score: number;
  rerankerScore?: number;
}

interface SearchDoc {
  document: {
    id: string;
    title: string;
    description: string;
    topicDomain: string;
    contentLanguage: string;
    geographicScope: string;
    contextualScope: string;
  };
  score: number;
  rerankerScore?: number;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"search" | "rag">("search");
  const [searchResults, setSearchResults] = useState<SearchDoc[]>([]);
  const [ragAnswer, setRagAnswer] = useState("");
  const [ragSources, setRagSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState("");

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearchResults([]);
    setRagAnswer("");
    setRagSources([]);

    try {
      if (activeTab === "search") {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(query)}&top=5`,
        );
        const data = await res.json();
        if (data.success) {
          setSearchResults(data.results);
        }
      } else {
        const res = await fetch("/api/rag", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: query }),
        });
        const data = await res.json();
        if (data.success) {
          setRagAnswer(data.answer);
          setRagSources(data.sources);
        }
      }
    } catch (err) {
      console.error("Request failed:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSeed() {
    setSeeding(true);
    setSeedResult("");
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      const data = await res.json();
      setSeedResult(
        data.success
          ? `Seeded ${data.documents.length} documents successfully!`
          : `Error: ${data.message}`,
      );
    } catch (err) {
      setSeedResult("Seed request failed");
      console.error(err);
    } finally {
      setSeeding(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Hybrid Search & RAG
        </h1>
        <p className="mb-8 text-gray-500">
          Azure AI Search (keyword + vector + semantic reranking) with
          Retrieval-Augmented Generation
        </p>

        {/* Seed Button */}
        <div className="mb-6">
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="rounded bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
          >
            {seeding ? "Seeding..." : "Seed Mock Data (20 subjects)"}
          </button>
          {seedResult && (
            <p className="mt-2 text-sm text-gray-600">{seedResult}</p>
          )}
        </div>

        {/* Tabs */}
        <div className="mb-4 flex gap-2">
          <button
            onClick={() => setActiveTab("search")}
            className={`rounded-t px-4 py-2 text-sm font-medium ${
              activeTab === "search"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Hybrid Search
          </button>
          <button
            onClick={() => setActiveTab("rag")}
            className={`rounded-t px-4 py-2 text-sm font-medium ${
              activeTab === "rag"
                ? "bg-purple-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            RAG (Ask a Question)
          </button>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8 flex gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              activeTab === "search"
                ? "Search subjects (e.g., machine learning, web development)..."
                : "Ask a question (e.g., What courses cover AI ethics?)..."
            }
            className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "..." : activeTab === "search" ? "Search" : "Ask"}
          </button>
        </form>

        {/* Search Results */}
        {activeTab === "search" && searchResults.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700">
              {searchResults.length} Results
            </h2>
            {searchResults.map((r) => (
              <div
                key={r.document.id}
                className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="mb-2 flex items-start justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {r.document.title}
                  </h3>
                  <div className="flex gap-2 text-xs">
                    <span className="rounded bg-blue-100 px-2 py-1 text-blue-700">
                      Score: {r.score.toFixed(3)}
                    </span>
                    {r.rerankerScore != null && (
                      <span className="rounded bg-purple-100 px-2 py-1 text-purple-700">
                        Reranker: {r.rerankerScore.toFixed(3)}
                      </span>
                    )}
                  </div>
                </div>
                <p className="mb-3 text-gray-600">{r.document.description}</p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="rounded bg-gray-100 px-2 py-1 text-gray-600">
                    {r.document.topicDomain}
                  </span>
                  <span className="rounded bg-gray-100 px-2 py-1 text-gray-600">
                    {r.document.contentLanguage}
                  </span>
                  <span className="rounded bg-gray-100 px-2 py-1 text-gray-600">
                    {r.document.geographicScope}
                  </span>
                  <span className="rounded bg-gray-100 px-2 py-1 text-gray-600">
                    {r.document.contextualScope}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* RAG Response */}
        {activeTab === "rag" && ragAnswer && (
          <div className="space-y-4">
            <div className="rounded-lg border border-purple-200 bg-purple-50 p-5">
              <h2 className="mb-3 text-lg font-semibold text-purple-900">
                AI Answer
              </h2>
              <p className="whitespace-pre-wrap text-gray-800">{ragAnswer}</p>
            </div>

            {ragSources.length > 0 && (
              <div>
                <h3 className="mb-2 text-sm font-semibold text-gray-600">
                  Sources
                </h3>
                <div className="space-y-2">
                  {ragSources.map((s, i) => (
                    <div
                      key={s.id}
                      className="flex items-center gap-3 rounded border border-gray-200 bg-white p-3 text-sm"
                    >
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-purple-700">
                        {i + 1}
                      </span>
                      <span className="font-medium text-gray-900">
                        {s.title}
                      </span>
                      <span className="text-gray-400">|</span>
                      <span className="text-gray-500">{s.topicDomain}</span>
                      <span className="ml-auto text-xs text-gray-400">
                        Score: {s.score.toFixed(3)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty state */}
        {!loading &&
          activeTab === "search" &&
          searchResults.length === 0 &&
          !ragAnswer && (
            <p className="text-center text-gray-400">
              Enter a query and hit Search to see hybrid results.
            </p>
          )}
        {!loading && activeTab === "rag" && !ragAnswer && (
          <p className="text-center text-gray-400">
            Ask a question to get an AI-generated answer grounded in the indexed
            documents.
          </p>
        )}
      </div>
    </div>
  );
}
