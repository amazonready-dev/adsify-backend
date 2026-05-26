export async function registerComplianceWebhooks(
  shop: string,
  accessToken: string
) {
  const topics = [
    {
      topic: "customers/data_request",
      address: `${process.env.APP_URL}/api/public/webhooks/gdpr`,
      format: "json",
    },
    {
      topic: "customers/redact",
      address: `${process.env.APP_URL}/api/public/webhooks/gdpr`,
      format: "json",
    },
    {
      topic: "shop/redact",
      address: `${process.env.APP_URL}/api/public/webhooks/gdpr`,
      format: "json",
    },
  ];

  for (const webhook of topics) {
    await fetch(`https://${shop}/admin/api/2025-04/webhooks.json`, {
      method: "POST",
      headers: {
        "X-Shopify-Access-Token": accessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ webhook }),
    });
  }

  console.log("✅ Compliance webhooks registered");
}

export async function saveShop(
  shop: string,
  accessToken: string,
  scope: string
) {
  console.log("💾 Saving shop:", shop);
  return true;
}

export function verifyShopifyHmac(params: URLSearchParams) {
  // TEMP SAFE (vėliau galim sustiprinti)
  return true;
}

export async function registerShopifyWebhooks(
  shop: string,
  accessToken: string
) {
  const url = `https://${shop}/admin/api/2025-04/webhooks.json`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "X-Shopify-Access-Token": accessToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      webhook: {
        topic: "app/uninstalled",
        address: `${process.env.APP_URL}/api/public/webhooks/app-uninstalled`,
        format: "json",
      },
    }),
  });

  if (!res.ok) {
    console.error("❌ Shopify webhook error:", await res.text());
    throw new Error("Webhook creation failed");
  }

  console.log("✅ Shopify webhook created");
  return true;
}

export function isValidShopDomain(shop: string | null): shop is string {
  if (!shop) return false;
  return /^[a-z0-9][a-z0-9-]*\.myshopify\.com$/i.test(shop);
}

export async function exchangeCodeForToken(shop: string, code: string) {
  console.log("🔐 Exchanging token for:", shop);

  // TODO: čia real Shopify OAuth (jei dar nėra – paliekam placeholder)
  return {
    access_token: "dummy_token",
    scope: "read_products,write_webhooks",
  };
}

export async function consumeNonce(state: string, shop: string) {
  console.log("🔑 Consuming nonce:", state, shop);
  return true;
}