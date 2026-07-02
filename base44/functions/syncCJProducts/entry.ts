import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const CJ_BASE_URL = 'https://developers.cjdropshipping.com/api2.0/v1';
const USD_TO_SAR = 3.75;

// Cached CJ access token (persists across invocations in the same isolate)
let cachedToken = null;
let tokenExpiry = 0;

async function getCJAccessToken() {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;
  const apiKey = Deno.env.get('CJ_API_KEY');
  if (!apiKey) throw new Error('CJ_API_KEY not set');
  const res = await fetch(`${CJ_BASE_URL}/authentication/getAccessToken`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiKey }),
  });
  const data = await res.json();
  if (!data.result || !data.data?.accessToken) {
    throw new Error(data.message || 'Failed to get CJ access token');
  }
  cachedToken = data.data.accessToken;
  tokenExpiry = Date.now() + 100 * 60 * 1000; // 100 minutes
  return cachedToken;
}

const CATEGORY_KEYWORDS = {
  electronics: 'electronics gadget',
  clothing: 'clothing fashion apparel',
  home: 'home decor kitchen',
  beauty: 'beauty cosmetic skincare',
  sports: 'sports fitness outdoor',
  food: 'food snack',
  books: 'book reading',
  toys: 'toy kids baby',
  general: 'popular trending product',
};

function normalizeCJProduct(p, category) {
  const rawPrice = p.sellPrice?.split(' -- ')?.[0] || p.sellPrice || '0';
  const costSAR = parseFloat((parseFloat(rawPrice) * USD_TO_SAR).toFixed(2));
  const retailPrice = parseFloat((costSAR * 1.5).toFixed(2));
  const originalPrice = parseFloat((retailPrice * 1.3).toFixed(2));
  return {
    cj_product_id: String(p.id),
    name: p.nameEn,
    name_en: p.nameEn,
    description: p.description || p.nameEn,
    category,
    image: p.bigImage || '',
    images: [p.bigImage].filter(Boolean),
    price_sar: retailPrice,
    original_price_sar: originalPrice,
    cost_sar: costSAR,
    brand: p.supplierName || 'R souq',
    stock: p.warehouseInventoryNum || 100,
    supplier_name: p.supplierName || '',
    last_synced: new Date().toISOString(),
  };
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const token = await getCJAccessToken();
    const headers = { 'CJ-Access-Token': token, 'Content-Type': 'application/json' };

    let totalSynced = 0;
    const results = {};

    for (const [category, keyword] of Object.entries(CATEGORY_KEYWORDS)) {
      try {
        // Search CJ products for this category (with retry on rate limit)
        const params = new URLSearchParams({ page: '1', size: '20', keyWord: keyword });
        let data = null;
        for (let attempt = 0; attempt < 3; attempt++) {
          const res = await fetch(`${CJ_BASE_URL}/product/listV2?${params}`, { headers });
          data = await res.json();
          if (data.result) break;
          if (data.message?.includes('Too Many Requests') && attempt < 2) {
            await new Promise(r => setTimeout(r, 5000 * (attempt + 1))); // 5s, 10s
            continue;
          }
          break;
        }

        if (!data || !data.result) {
          results[category] = { error: data?.message || 'CJ API error', synced: 0 };
          await new Promise(r => setTimeout(r, 2500));
          continue;
        }

        const cjProducts = data.data?.content?.[0]?.productList || [];

        // Batch translate names to Arabic using LLM
        let arabicNames = [];
        if (cjProducts.length > 0) {
          try {
            const nameList = cjProducts.map((p, i) => `${i + 1}. ${p.nameEn}`).join('\n');
            const llmRes = await base44.asServiceRole.integrations.Core.InvokeLLM({
              prompt: `Translate the following product names from English to Arabic. Return a JSON object with a "translations" array containing the Arabic translations in the same order as the input. Keep brand names and model numbers in English. Product names:\n${nameList}`,
              response_json_schema: {
                type: 'object',
                properties: {
                  translations: {
                    type: 'array',
                    items: { type: 'string' }
                  }
                },
                required: ['translations']
              }
            });
            arabicNames = llmRes?.translations || [];
          } catch (e) {
            console.log(`Translation failed for ${category}:`, e.message);
          }
        }

        // Upsert products into CJProductCache
        let synced = 0;
        for (let i = 0; i < cjProducts.length; i++) {
          const normalized = normalizeCJProduct(cjProducts[i], category);
          if (arabicNames[i]) normalized.name = arabicNames[i];

          try {
            const existing = await base44.asServiceRole.entities.CJProductCache.filter({ cj_product_id: normalized.cj_product_id });
            if (existing && existing.length > 0) {
              await base44.asServiceRole.entities.CJProductCache.update(existing[0].id, normalized);
            } else {
              await base44.asServiceRole.entities.CJProductCache.create(normalized);
            }
            synced++;
            totalSynced++;
          } catch (e) {
            console.log(`Failed to upsert product ${normalized.cj_product_id}:`, e.message);
          }
        }

        results[category] = { synced, total: cjProducts.length };
        // Delay between categories to avoid CJ rate limiting
        await new Promise(r => setTimeout(r, 2500));
      } catch (e) {
        results[category] = { error: e.message, synced: 0 };
        await new Promise(r => setTimeout(r, 2500));
      }
    }

    return Response.json({ success: true, totalSynced, results });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});