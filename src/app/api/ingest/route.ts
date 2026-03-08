import { consolidationService } from "@/services/consolidationService";
import { uploadBlob } from "@/services/azureBlobService";
import { indexDocument, SubjectDocument } from "@/services/azureSearchService";
import { NextRequest, NextResponse } from "next/server";
import { parseStringPromise } from "xml2js";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let reqBody;

    if (contentType.includes("application/json")) {
      reqBody = await req.json();
    } else if (
      contentType.includes("application/xml") ||
      contentType.includes("text/xml")
    ) {
      reqBody = await req.text();
      reqBody = await parseStringPromise(reqBody);
    } else {
      return NextResponse.json(
        {
          message:
            "Unsupported content type. Use application/json or application/xml",
        },
        { status: 415 },
      );
    }

    // Step 1: Consolidate via Gemini
    const result = await consolidationService(reqBody);

    if (!result.success || !result.data) {
      return NextResponse.json(result, { status: 422 });
    }

    // Step 2: Upload to Azure Blob
    const docId = randomUUID();
    const blobName = `${docId}.json`;
    const blobUrl = await uploadBlob(blobName, result.data);

    // Step 3: Index in Azure AI Search (with vector embedding)
    const searchDoc: SubjectDocument = {
      id: docId,
      ...result.data,
      blobUrl,
      timestamp: result.timestamp,
    };
    await indexDocument(searchDoc);

    return NextResponse.json(
      {
        ...result,
        blobUrl,
        documentId: docId,
        indexed: true,
      },
      { status: 200 },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    const isClientError =
      message.includes("reqBody is required") ||
      message.includes("Unsupported content type");
    return NextResponse.json(
      { success: false, message },
      { status: isClientError ? 400 : 500 },
    );
  }
}
