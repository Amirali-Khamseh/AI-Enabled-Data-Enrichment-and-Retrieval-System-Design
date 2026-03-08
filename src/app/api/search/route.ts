import { NextRequest, NextResponse } from "next/server";
import { hybridSearch } from "@/services/azureSearchService";

export async function GET(req: NextRequest) {
  try {
    const query = req.nextUrl.searchParams.get("q");
    const top = parseInt(req.nextUrl.searchParams.get("top") || "5", 10);

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: "Query parameter 'q' is required" },
        { status: 400 },
      );
    }

    const results = await hybridSearch(query, top);

    return NextResponse.json(
      {
        success: true,
        query,
        count: results.length,
        results,
      },
      { status: 200 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Search failed";
    console.error("Search error:", error);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
