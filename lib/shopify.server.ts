export async function registerComplianceWebhooks() {}
export async function saveShop() {}
export function verifyShopifyHmac() { return true; }
export async function registerShopifyWebhooks() {}
export function isValidShopDomain() { return true; }
export async function exchangeCodeForToken() {
  return { access_token: "dummy", scope: "" };
}
export async function consumeNonce() { return true; }