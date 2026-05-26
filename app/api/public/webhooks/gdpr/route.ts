import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();

    console.log("GDPR WEBHOOK HIT:", body);

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("GDPR webhook error:", err);

    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true });
}