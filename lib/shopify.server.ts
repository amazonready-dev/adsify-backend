// lib/shopify.server.ts

export async function registerComplianceWebhooks(
  _shop?: string,
  _accessToken?: string
) {
  return true;
}

export async function saveShop(
  _shop?: string,
  _accessToken?: string,
  _scope?: string
) {
  return true;
}

export function verifyShopifyHmac(_params?: URLSearchParams) {
  return true;
}

export async function registerShopifyWebhooks(
  _shop?: string,
  _accessToken?: string
) {
  return true;
}

export function isValidShopDomain(shop: string | null): shop is string {
  if (!shop) return false;
  return /^[a-z0-9][a-z0-9-]*\.myshopify\.com$/i.test(shop);
}

export async function exchangeCodeForToken(
  _shop?: string,
  _code?: string
) {
  return { access_token: "dummy", scope: "" };
}

export async function consumeNonce(
  _state?: string,
  _shop?: string
) {
  return true;
}