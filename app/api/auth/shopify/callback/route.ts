import { NextRequest, NextResponse } from "next/server";
import {
  consumeNonce,
  exchangeCodeForToken,
  isValidShopDomain,
  registerComplianceWebhooks,
  saveShop,
  verifyShopifyHmac,
  registerShopifyWebhooks,
} from "@/lib/shopify.server";

export async function GET(req: NextRequest) {
  try {
    console.log("👉 CALLBACK START");

    const url = new URL(req.url);
    const params = url.searchParams;

    const shop = params.get("shop");
    const code = params.get("code");
    const state = params.get("state");

    console.log("👉 PARAMS:", { shop, code, state });

    if (!isValidShopDomain(shop) || !code || !state) {
      console.log("❌ BAD REQUEST PARAMS");
      return NextResponse.json({ error: "Bad request" }, { status: 400 });
    }

    if (!verifyShopifyHmac(params)) {
      console.log("❌ INVALID HMAC");
      return NextResponse.json({ error: "Invalid HMAC" }, { status: 401 });
    }

    const ok = await consumeNonce(state, shop);
    if (!ok) {
      console.log("❌ INVALID STATE");
      return NextResponse.json({ error: "Invalid state" }, { status: 401 });
    }

    console.log("👉 EXCHANGING TOKEN");

    const { access_token, scope } = await exchangeCodeForToken(shop, code);

    console.log("👉 TOKEN RECEIVED");

    await saveShop(shop, access_token, scope);
    console.log("👉 SHOP SAVED");

    await registerShopifyWebhooks(shop, access_token);
    console.log("👉 WEBHOOKS REGISTERED");

    await registerComplianceWebhooks(shop, access_token);
    console.log("👉 COMPLIANCE WEBHOOKS DONE");

    console.log("👉 CALLBACK DONE");

    return NextResponse.redirect(`https://${shop}/admin/apps`, 302);
  } catch (err) {
    console.error("🔥 CALLBACK ERROR:", err);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}