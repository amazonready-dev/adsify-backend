import crypto from "crypto";

export async function POST(req: Request) {
  const body = await req.text();

  const hmacHeader = req.headers.get("x-shopify-hmac-sha256");
  const shopifySecret = process.env.SHOPIFY_API_SECRET || "";

  if (!hmacHeader) {
    return new Response("Missing HMAC", { status: 401 });
  }

  const generatedHash = crypto
    .createHmac("sha256", shopifySecret)
    .update(body, "utf8")
    .digest("base64");

  const safeCompare =
    generatedHash.length === hmacHeader.length &&
    crypto.timingSafeEqual(Buffer.from(generatedHash), Buffer.from(hmacHeader));

  if (!safeCompare) {
    return new Response("Invalid HMAC", { status: 401 });
  }

  console.log("Valid Shopify webhook:", body);

  return new Response("OK", { status: 200 });
}