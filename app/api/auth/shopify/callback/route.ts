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
    console.log("🚀 CALLBACK START");

    const url = new URL(req.url);
    const params = url.searchParams;

    const shop = params.get("shop");
    const code = params.get("code");
    const state = params.get("state");

    console.log("📦 PARAMS:", { shop, code: !!code, state });

    if (!isValidShopDomain(shop)) {
      console.log("❌ Invalid shop domain");
      return NextResponse.json({ error: "Invalid shop" }, { status: 400 });
    }

    if (!code || !state) {
      console.log("❌ Missing code/state");
      return NextResponse.json({ error: "Missing params" }, { status: 400 });
    }

    if (!verifyShopifyHmac(params)) {
      console.log("❌ Invalid HMAC");
      return NextResponse.json({ error: "Invalid HMAC" }, { status: 401 });
    }

    const nonceOk = await consumeNonce(state, shop);
    if (!nonceOk) {
      console.log("❌ Invalid nonce/state");
      return NextResponse.json({ error: "Invalid state" }, { status: 401 });
    }

    console.log("🔐 Exchanging token...");

    const { access_token, scope } = await exchangeCodeForToken(shop, code);

    console.log("✅ Token received");

    console.log("💾 Saving shop...");
    await saveShop(shop, access_token, scope);

    // 🔥 WEBHOOK REGISTRATION ZONE (DEBUG FRIENDLY)
    console.log("👉 REGISTER SHOPIFY WEBHOOKS START");

    try {
      const res1 = await registerShopifyWebhooks(shop, access_token);
      console.log("✅ SHOPIFY WEBHOOKS OK:", res1);
    } catch (err) {
      console.error("❌ SHOPIFY WEBHOOK FAILED:", err);
    }

    console.log("👉 REGISTER COMPLIANCE WEBHOOKS START");

    try {
      const res2 = await registerComplianceWebhooks(shop, access_token);
      console.log("✅ COMPLIANCE WEBHOOKS OK:", res2);
    } catch (err) {
      console.error("❌ COMPLIANCE WEBHOOK FAILED:", err);
    }

    console.log("🎯 CALLBACK FINISHED");

    return NextResponse.redirect(
      `https://${shop}/admin/apps`,
      302
    );
  } catch (err) {
    console.error("🔥 CALLBACK FATAL ERROR:", err);

    return NextResponse.json(
      {
        error: "Internal error",
        message: err instanceof Error ? err.message : "Unknown",
      },
      { status: 500 }
    );
  }
}