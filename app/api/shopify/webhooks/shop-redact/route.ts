import crypto from "crypto";
import { headers } from "next/headers";

export async function POST(req: Request) {
  try {
    const body = await req.text();

    const hmacHeader = headers().get("x-shopify-hmac-sha256");
    if (!hmacHeader) {
      return new Response("Missing HMAC", { status: 401 });
    }

    const secret = process.env.SHOPIFY_API_SECRET;
    if (!secret) {
      return new Response("Missing secret", { status: 500 });
    }

    const generatedHmac = crypto
      .createHmac("sha256", secret)
      .update(body, "utf8")
      .digest("base64");

    const safeCompare =
      generatedHmac.length === hmacHeader.length &&
      crypto.timingSafeEqual(Buffer.from(generatedHmac), Buffer.from(hmacHeader));

    if (!safeCompare) {
      return new Response("Invalid HMAC", { status: 401 });
    }

    return new Response("ok", { status: 200 });
  } catch (err) {
    return new Response("Server error", { status: 500 });
  }
}