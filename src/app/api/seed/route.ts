import { NextResponse } from "next/server";
import { uploadBlob } from "@/services/azureBlobService";
import {
  createSearchIndex,
  indexDocuments,
  SubjectDocument,
} from "@/services/azureSearchService";
import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";

export async function POST() {
  try {
    // Step 1: Ensure the search index exists
    await createSearchIndex();

    // Step 2: Read all mockData files
    const mockDataDir = path.join(process.cwd(), "mockData");
    const files = await fs.readdir(mockDataDir);
    const jsonFiles = files.filter((f) => f.endsWith(".json"));

    const documents: SubjectDocument[] = [];

    // Step 3: Upload each to Blob and prepare for indexing
    for (const file of jsonFiles) {
      const filePath = path.join(mockDataDir, file);
      const raw = await fs.readFile(filePath, "utf-8");
      const data = JSON.parse(raw.replace(/^\uFEFF/, ""));

      const docId = randomUUID();
      const blobName = `${docId}.json`;
      const blobUrl = await uploadBlob(blobName, data);

      documents.push({
        id: docId,
        title: data.title,
        description: data.description,
        language: data.language,
        topicDomain: data.topicDomain,
        contentLanguage: data.contentLanguage,
        geographicScope: data.geographicScope,
        contextualScope: data.contextualScope,
        blobUrl,
        timestamp: new Date().toISOString(),
      });
    }

    // Step 4: Batch index all documents (with embeddings)
    await indexDocuments(documents);

    return NextResponse.json(
      {
        success: true,
        message: `Seeded ${documents.length} documents`,
        documents: documents.map((d) => ({
          id: d.id,
          title: d.title,
          blobUrl: d.blobUrl,
        })),
      },
      { status: 200 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Seed failed";
    console.error("Seed error:", error);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
