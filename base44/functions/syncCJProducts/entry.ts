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
  // Several specific, everyday queries instead of one broad "clothing/apparel"
  // term — broad apparel searches on CJ surface a lot of adult/fetish wear
  // alongside normal clothing. Narrow queries mostly avoid that at the source
  // (the BLOCKED_TERMS filter below is a backup, not the only line of defense).
  clothing: ['men casual shirt', 'women summer dress', 'kids t-shirt cotton', 'denim jeans pants', 'winter jacket parka coat'],
  home: 'home decor kitchen',
  beauty: 'beauty cosmetic skincare',
  sports: 'sports fitness outdoor',
  food: 'food snack',
  books: 'book reading',
  toys: 'toy kids baby',
  general: 'popular trending product',
};

// CJ's "clothing/apparel" search also surfaces underwear, lingerie and other
// revealing items. Filter those out so the storefront only shows regular,
// family-appropriate clothing — regardless of how CJ itself categorized them.
const BLOCKED_TERMS = [
  'sexy', 'lingerie', 'underwear', 'thong', 'bikini', 'panties', 'panty',
  'g-string', 'gstring', 'erotic', 'fetish', 'stripper', 'nude', 'naked',
  'bra ', 'bras ', 'boxer brief', 'crotchless', 'lace teddy', 'bodystocking',
  'fishnet', 'seductive', 'temptation lingerie', 'sleepwear sexy',
  'harness', 'jockstrap', 'bondage', 'clubwear', 'mesh bodysuit', 'pvc',
  'latex', 'wetlook', 'see-through', 'see through', 'sheer', 'exotic dancewear',
  'male stripper', 'aussiebum', 'disco', 'nightclub', 'night club', 'exotic',
  'tanga', 'net stocking', 'fishnet stocking', 'open crotch', 'mesh stocking',
  'bodysuit fishnet', 'strappy bodysuit', 'transparent',
  // Broader adult/BDSM/roleplay vertical (mask/hood/catsuit/restraint gear
  // that CJ's fuzzy search matches even on innocuous words like "hoodie")
  'catsuit', 'zentai', 'chastity', 'restraint', 'muzzle', 'puppy play',
  'pet play', 'bdsm', 'kinky', 'gimp', 'rubber hood', 'leather hood',
  'leather mask', 'dog mask', 'dog hood', 'bondage hood', 'ball gag',
  'gag ball', 'spreader bar', 'flogger', 'whip', 'slave collar',
  'strap-on', 'strapon', 'adult costume', 'roleplay costume', 'chest harness',
  'leg harness', 'body harness', 'muscle harness', 'cage bra', 'humbler',
  'faux leather bodysuit', 'pu leather bodysuit', 'wetlook catsuit',
  'one-piece tight', 'shiny bodysuit', 'skin tight jumpsuit', 'full body suit',
];

// Product category names as classified by CJ itself (oneCategoryName /
// twoCategoryName / threeCategoryName) — a more reliable signal than the
// product title, since CJ's own taxonomy will say things like "Sexy
// Costumes" or "Fetish Wear" even when the English title doesn't.
const BLOCKED_CJ_CATEGORY_TERMS = [
  'sexy', 'fetish', 'erotic', 'adult', 'lingerie', 'underwear', 'bdsm',
  'costume', 'cosplay', 'roleplay', 'exotic', 'clubwear', 'bondage',
];

function isDecentProduct(p) {
  const text = `${p.nameEn || ''} ${p.description || ''}`.toLowerCase();
  if (BLOCKED_TERMS.some(term => text.includes(term))) return false;
  const catText = `${p.oneCategoryName || ''} ${p.twoCategoryName || ''} ${p.threeCategoryName || ''}`.toLowerCase();
  if (BLOCKED_CJ_CATEGORY_TERMS.some(term => catText.includes(term))) return false;
  return true;
}

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

    // One-time cleanup: remove any previously-synced cache entries (e.g. from
    // before the decency filter existed) that shouldn't be on the storefront.
    let removed = 0;
    try {
      const existingCache = await base44.asServiceRole.entities.CJProductCache.list();
      for (const item of existingCache) {
        const text = `${item.name || ''} ${item.name_en || ''} ${item.description || ''}`.toLowerCase();
        const isBad = BLOCKED_TERMS.some(term => text.includes(term));
        if (isBad) {
          await base44.asServiceRole.entities.CJProductCache.delete(item.id);
          removed++;
        }
      }
    } catch (e) {
      console.log('Cleanup pass failed:', e.message);
    }

    // Flatten into (category, keyword) pairs — categories with several safe
    // sub-keywords (like clothing) get one pass per sub-keyword, each pulling
    // fewer items so the total per category stays similar to before.
    const entries = [];
    for (const [category, kw] of Object.entries(CATEGORY_KEYWORDS)) {
      const kwList = Array.isArray(kw) ? kw : [kw];
      const size = Math.max(4, Math.ceil(20 / kwList.length));
      for (const keyword of kwList) entries.push({ category, keyword, size });
    }

    for (const { category, keyword, size } of entries) {
      try {
        // Search CJ products for this category (with retry on rate limit)
        const params = new URLSearchParams({ page: '1', size: String(size), keyWord: keyword });
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
          results[category] = results[category] || { synced: 0, total: 0 };
          results[category].error = data?.message || 'CJ API error';
          await new Promise(r => setTimeout(r, 2500));
          continue;
        }

        const cjProducts = (data.data?.content?.[0]?.productList || []).filter(isDecentProduct);

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

        results[category] = results[category] || { synced: 0, total: 0 };
        results[category].synced += synced;
        results[category].total += cjProducts.length;
        // Delay between requests to avoid CJ rate limiting
        await new Promise(r => setTimeout(r, 2500));
      } catch (e) {
        results[category] = results[category] || { synced: 0, total: 0 };
        results[category].error = e.message;
        await new Promise(r => setTimeout(r, 2500));
      }
    }

    return Response.json({ success: true, totalSynced, removed, results });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});