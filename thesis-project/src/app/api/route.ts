import { NextResponse } from "next/server";

export async function GET(res: NextResponse) {
  return NextResponse.json({ Message: "OK" }, { status: 200 });
}
