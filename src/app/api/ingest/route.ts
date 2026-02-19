import { consolidationService } from "@/services/consolidationService";
import { NextRequest, NextResponse } from "next/server";
import { parseStringPromise } from "xml2js";

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
    const result = await consolidationService(reqBody);
    return NextResponse.json(result, { status: 200 });
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
