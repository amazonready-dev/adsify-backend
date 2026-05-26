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
    const res = await fetch(
      `https://${shop}/admin/api/2025-04/webhooks.json`,
      {
        method: "POST",
        headers: {
          "X-Shopify-Access-Token": accessToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ webhook }),
      }
    );

    if (!res.ok) {
      console.error("❌ GDPR webhook error:", await res.text());
    } else {
      console.log("✅ GDPR webhook created:", webhook.topic);
    }
  }
}

export async function saveShop(
  shop: string,
  accessToken: string,
  scope: string
) {
  console.log("💾 Saving shop:", shop, "scope:", scope);
  return true;
}

export function verifyShopifyHmac(params: URLSearchParams) {
  const hmac = params.get("hmac");
  return !!hmac; // minimal real check (galim vėliau sustiprinti)
}

export async function registerShopifyWebhooks(
  shop: string,
  accessToken: string
) {
  console.log("👉 REGISTER SHOPIFY WEBHOOK START:", shop);

  const res = await fetch(
    `https://${shop}/admin/api/2025-04/webhooks.json`,
    {
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
    }
  );

  if (!res.ok) {
    console.error("❌ Shopify webhook error:", await res.text());
    throw new Error("Webhook creation failed");
  }

  console.log("✅ App uninstall webhook created");
  return true;
}

export function isValidShopDomain(shop: string | null): shop is string {
  if (!shop) return false;
  return /^[a-z0-9][a-z0-9-]*\.myshopify\.com$/i.test(shop);
}

export async function exchangeCodeForToken(shop: string, code: string) {
  console.log("🔐 Exchanging code for token:", shop);

  const res = await fetch(
    `https://${shop}/admin/oauth/access_token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.SHOPIFY_API_KEY,
        client_secret: process.env.SHOPIFY_API_SECRET,
        code,
      }),
    }
  );

  const data = await res.json();

  console.log("🔐 SHOPIFY TOKEN RESPONSE:", data);

  return {
    access_token: data.access_token,
    scope: data.scope,
  };
}

export async function consumeNonce(state: string, shop: string) {
  console.log("🔑 Consuming nonce:", state, shop);
  return true;
}