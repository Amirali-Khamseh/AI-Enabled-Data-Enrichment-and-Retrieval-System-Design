"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";

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

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("search");
  const [searchResults, setSearchResults] = useState<SearchDoc[]>([]);
  const [ragAnswer, setRagAnswer] = useState("");
  const [ragSources, setRagSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(false);

  function handleClose(value: boolean) {
    if (!value) {
      setQuery("");
      setSearchResults([]);
      setRagAnswer("");
      setRagSources([]);
    }
    onOpenChange(value);
  }

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

  const hasResults =
    searchResults.length > 0 || ragAnswer || ragSources.length > 0;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col gap-0 p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle>Search</DialogTitle>
          <DialogDescription>
            Search subjects or ask a question using AI-powered retrieval.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full">
              <TabsTrigger value="search" className="flex-1">
                Hybrid Search
              </TabsTrigger>
              <TabsTrigger value="rag" className="flex-1">
                Ask AI
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2 px-6 pt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                activeTab === "search"
                  ? "Search subjects (e.g., machine learning, web development)..."
                  : "Ask a question (e.g., What courses cover AI ethics?)..."
              }
              className="pl-9"
              autoFocus
            />
          </div>
          <Button type="submit" disabled={loading || !query.trim()}>
            {loading ? (
              <Spinner className="size-4" />
            ) : activeTab === "search" ? (
              "Search"
            ) : (
              "Ask"
            )}
          </Button>
        </form>

        <div className="flex-1 overflow-y-auto px-6 pt-4 pb-6">
          {/* Search Results */}
          {activeTab === "search" && searchResults.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">
                {searchResults.length} results
              </p>
              {searchResults.map((r) => (
                <div
                  key={r.document.id}
                  className="rounded-lg border bg-card p-4 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold leading-tight">
                      {r.document.title}
                    </h3>
                    <div className="flex shrink-0 gap-1">
                      <Badge variant="secondary" className="text-[10px]">
                        {r.score.toFixed(3)}
                      </Badge>
                      {r.rerankerScore != null && (
                        <Badge variant="outline" className="text-[10px]">
                          RR: {r.rerankerScore.toFixed(3)}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {r.document.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-[10px]">
                      {r.document.topicDomain}
                    </Badge>
                    <Badge variant="outline" className="text-[10px]">
                      {r.document.contentLanguage}
                    </Badge>
                    <Badge variant="outline" className="text-[10px]">
                      {r.document.geographicScope}
                    </Badge>
                    <Badge variant="outline" className="text-[10px]">
                      {r.document.contextualScope}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* RAG Response */}
          {activeTab === "rag" && ragAnswer && (
            <div className="space-y-4">
              <div className="rounded-lg border bg-card p-4">
                <h3 className="mb-2 text-sm font-semibold">AI Answer</h3>
                <p className="whitespace-pre-wrap text-sm text-muted-foreground leading-relaxed">
                  {ragAnswer}
                </p>
              </div>

              {ragSources.length > 0 && (
                <div>
                  <h3 className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Sources
                  </h3>
                  <div className="space-y-2">
                    {ragSources.map((s, i) => (
                      <div
                        key={s.id}
                        className="flex items-center gap-3 rounded-lg border bg-card p-3 text-sm"
                      >
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                          {i + 1}
                        </span>
                        <span className="font-medium truncate">
                          {s.title}
                        </span>
                        <Badge variant="outline" className="shrink-0 text-[10px]">
                          {s.topicDomain}
                        </Badge>
                        <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                          {s.score.toFixed(3)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Empty state */}
          {!loading && !hasResults && (
            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
              <Search className="h-10 w-10 mb-3 opacity-30" />
              <p className="text-sm">
                {activeTab === "search"
                  ? "Search for subjects across the curriculum."
                  : "Ask a question and get an AI-generated answer with sources."}
              </p>
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Spinner className="size-6" />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
