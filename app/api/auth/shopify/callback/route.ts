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
  const url = new URL(req.url);
  const params = url.searchParams;

  const shop = params.get("shop");
  const code = params.get("code");
  const state = params.get("state");

  if (!isValidShopDomain(shop) || !code || !state) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  if (!verifyShopifyHmac(params)) {
    return NextResponse.json({ error: "Invalid HMAC" }, { status: 401 });
  }

  const ok = await consumeNonce(state, shop);
  if (!ok) {
    return NextResponse.json({ error: "Invalid state" }, { status: 401 });
  }

  const { access_token, scope } = await exchangeCodeForToken(shop, code);

  await saveShop(shop, access_token, scope);

  await registerShopifyWebhooks(shop, access_token);
  await registerComplianceWebhooks(shop, access_token);

  return NextResponse.redirect(`https://${shop}/admin/apps`, 302);
}