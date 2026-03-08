import { NextRequest, NextResponse } from "next/server";
import { hybridSearch, SearchResult } from "@/services/azureSearchService";
import { chatCompletion } from "@/services/azureOpenAIService";

function buildContext(results: SearchResult[]): string {
  return results
    .map(
      (r, i) =>
        `[${i + 1}] Title: ${r.document.title}\n` +
        `Description: ${r.document.description}\n` +
        `Topic: ${r.document.topicDomain} | Scope: ${r.document.contextualScope} | Region: ${r.document.geographicScope}`,
    )
    .join("\n\n");
}

const SYSTEM_PROMPT = `You are a knowledgeable academic assistant. Answer the user's question based ONLY on the provided context documents. 
If the context does not contain enough information, say so clearly.
Cite the relevant document numbers in brackets like [1], [2] when referencing information.
Be concise and accurate.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { question } = body;

    if (
      !question ||
      typeof question !== "string" ||
      question.trim().length === 0
    ) {
      return NextResponse.json(
        { success: false, message: "Field 'question' is required" },
        { status: 400 },
      );
    }

    // Step 1: Retrieve relevant documents via hybrid search
    const searchResults = await hybridSearch(question, 5);

    // Step 2: Build context from search results
    const context = buildContext(searchResults);

    // Step 3: Generate answer using Azure OpenAI
    const userMessage = `Context:\n${context}\n\nQuestion: ${question}`;
    const answer = await chatCompletion(SYSTEM_PROMPT, userMessage);

    return NextResponse.json(
      {
        success: true,
        question,
        answer,
        sources: searchResults.map((r) => ({
          id: r.document.id,
          title: r.document.title,
          topicDomain: r.document.topicDomain,
          score: r.score,
          rerankerScore: r.rerankerScore,
        })),
      },
      { status: 200 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "RAG query failed";
    console.error("RAG error:", error);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
