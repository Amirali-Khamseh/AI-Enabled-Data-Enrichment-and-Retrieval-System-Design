import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ Message: "OK" }, { status: 200 });
}
