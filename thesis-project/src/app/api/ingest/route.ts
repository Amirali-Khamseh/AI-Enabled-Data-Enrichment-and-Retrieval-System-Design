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

    return NextResponse.json({ message: reqBody }, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json({ message }, { status: 500 });
  }
}
