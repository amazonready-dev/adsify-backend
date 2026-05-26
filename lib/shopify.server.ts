export async function registerComplianceWebhooks() {}
export async function saveShop() {}
export function verifyShopifyHmac() { return true; }

export async function registerShopifyWebhooks() {}

export function isValidShopDomain(shop: string | null): shop is string {
  if (!shop) return false;
  return /^[a-z0-9][a-z0-9-]*\.myshopify\.com$/i.test(shop);
}

export async function exchangeCodeForToken() {
  return { access_token: "dummy", scope: "" };
}

export async function consumeNonce() { return true; }