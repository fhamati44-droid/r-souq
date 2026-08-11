import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const CJ_BASE_URL = 'https://developers.cjdropshipping.com/api2.0/v1';

// Cached CJ access token (persists across invocations in the same isolate)
let cachedToken = null;
let tokenExpiry = 0;

async function getCJAccessToken() {
  // Reuse cached token if still valid (CJ tokens last ~2 hours; refresh after 100 min)
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

// Fetch with retry on rate limit
async function cjFetch(url, options, retries = 1) {
  for (let i = 0; i <= retries; i++) {
    const res = await fetch(url, options);
    const data = await res.json();
    if (data.result) return data;
    // Rate limited — wait and retry
    if (data.message?.includes('Too Many Requests') && i < retries) {
      await new Promise(r => setTimeout(r, 2000));
      continue;
    }
    return data;
  }
  return { result: false, message: 'Too Many Requests' };
}

const CATEGORY_MAP = {
  'clothing': 'clothing', 'fashion': 'clothing', 'apparel': 'clothing', 'women': 'clothing', 'men': 'clothing',
  'electronics': 'electronics', 'computer': 'electronics', 'phone': 'electronics', 'gadget': 'electronics',
  'home': 'home', 'furniture': 'home', 'kitchen': 'home', 'garden': 'home',
  'sports': 'sports', 'outdoor': 'sports', 'fitness': 'sports',
  'beauty': 'beauty', 'health': 'beauty', 'cosmetic': 'beauty',
  'books': 'books', 'education': 'books',
  'toys': 'toys', 'baby': 'toys', 'kids': 'toys',
  'food': 'food', 'grocery': 'food',
};

function mapCategory(oneCategoryName = '') {
  const lower = oneCategoryName.toLowerCase();
  for (const [key, val] of Object.entries(CATEGORY_MAP)) {
    if (lower.includes(key)) return val;
  }
  return 'general';
}

// Keep underwear/lingerie/etc. out of what sellers see in the Warehouse too —
// same list used in syncCJProducts.
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
];

function isDecentProduct(p) {
  const text = `${p.nameEn || ''} ${p.description || ''}`.toLowerCase();
  return !BLOCKED_TERMS.some(term => text.includes(term));
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { action, keyword, page = 1, size = 20, categoryId } = body;

    // Only restrict import/bulk actions to admins; search & shipping are open to all authenticated users
    const adminOnlyActions = ['import', 'importBulk'];
    if (adminOnlyActions.includes(action) && user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const token = await getCJAccessToken();
    const headers = { 'CJ-Access-Token': token, 'Content-Type': 'application/json' };

    // Search products from CJ
    if (action === 'search') {
      const params = new URLSearchParams({ page: String(page), size: String(size) });
      if (keyword) params.append('keyWord', keyword);
      if (categoryId) params.append('categoryId', categoryId);

      const data = await cjFetch(`${CJ_BASE_URL}/product/listV2?${params}`, { headers });

      if (!data.result) {
        return Response.json({ error: data.message || 'CJ API error' }, { status: 400 });
      }

      const products = (data.data?.content?.[0]?.productList || []).filter(isDecentProduct);
      return Response.json({ products, total: data.data?.totalRecords || 0, pages: data.data?.totalPages || 0 });
    }

    // Get single product detail from CJ
    if (action === 'getProduct') {
      const { productId } = body;
      if (!productId) return Response.json({ error: 'No productId' }, { status: 400 });

      const res = await fetch(`${CJ_BASE_URL}/product/query?productId=${productId}`, { headers });
      const data = await res.json();
      if (!data.result) {
        return Response.json({ error: data.message || 'CJ API error' }, { status: 400 });
      }
      return Response.json({ product: data.data });
    }

    // Get shipping cost for a product to Saudi Arabia
    if (action === 'getShipping') {
      const { productId, quantity = 1 } = body;
      if (!productId) return Response.json({ error: 'No productId' }, { status: 400 });

      // Step 1: get product detail to find a valid vid
      // Try variant/query first, then fall back to product detail endpoint
      let vid = null;

      // CJ variant/query endpoint - try with pid param
      const variantData = await cjFetch(`${CJ_BASE_URL}/product/variant/query?pid=${productId}`, { headers });
      const variants = Array.isArray(variantData.data) ? variantData.data : [];
      if (variants.length > 0) {
        vid = variants[0].vid || variants[0].variantId || variants[0].id;
      }
      console.log('variant/query result:', variantData.message, '| variants:', variants.length, '| vid:', vid);

      if (!vid) {
        return Response.json({ shippingCost: 0, options: [], error: 'No vid found for this product' });
      }

      const productPayload = { vid, quantity };

      // Step 2: calculate freight
      const data = await cjFetch(`${CJ_BASE_URL}/logistic/freightCalculate`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          startCountryCode: 'CN',
          endCountryCode: 'SA',
          products: [productPayload],
        }),
      });

      if (!data.result || !data.data) {
        return Response.json({ shippingCost: 0, options: [], raw: data });
      }

      const options = (data.data || []).map(o => ({
        name: o.logisticName,
        cost: parseFloat(o.logisticPrice) || 0,
        days: o.logisticAging,
      }));
      const validOptions = options.filter(o => o.cost > 0);
      const cheapest = validOptions.length > 0
        ? validOptions.reduce((a, b) => (a.cost < b.cost ? a : b))
        : { cost: 0 };
      const costUSD = cheapest.cost || 0;
      const costSAR = parseFloat((costUSD * 3.75).toFixed(2));

      return Response.json({ shippingCost: costSAR, options, cheapest });
    }

    // Import single product to warehouse
    if (action === 'import') {
      const { product } = body;
      if (!product) return Response.json({ error: 'No product provided' }, { status: 400 });

      const existing = await base44.asServiceRole.entities.WarehouseProduct.filter({ cj_product_id: product.id });
      if (existing && existing.length > 0) {
        return Response.json({ success: false, message: 'المنتج موجود مسبقاً في المستودع' });
      }

      await base44.asServiceRole.entities.WarehouseProduct.create({
        warehouse_product_id: `cj_${product.id}`,
        name: product.nameEn,
        description: product.description || product.nameEn,
        category: mapCategory(product.oneCategoryName),
        images: [product.bigImage].filter(Boolean),
        suggested_price: parseFloat(product.sellPrice) || 0,
        cost_price: parseFloat(product.nowPrice) || parseFloat(product.sellPrice) || 0,
        brand: product.supplierName || 'CJ Dropshipping',
        is_active: true,
        cj_product_id: product.id,
        cj_sku: product.sku,
      });
      return Response.json({ success: true });
    }

    // Bulk import products
    if (action === 'importBulk') {
      const { products } = body;
      if (!products || !products.length) return Response.json({ error: 'No products' }, { status: 400 });

      let imported = 0;
      let skipped = 0;
      for (const product of products) {
        const existing = await base44.asServiceRole.entities.WarehouseProduct.filter({ cj_product_id: product.id });
        if (existing && existing.length > 0) { skipped++; continue; }

        await base44.asServiceRole.entities.WarehouseProduct.create({
          warehouse_product_id: `cj_${product.id}`,
          name: product.nameEn,
          description: product.description || product.nameEn,
          category: mapCategory(product.oneCategoryName),
          images: [product.bigImage].filter(Boolean),
          suggested_price: parseFloat(product.sellPrice) || 0,
          cost_price: parseFloat(product.nowPrice) || parseFloat(product.sellPrice) || 0,
          brand: product.supplierName || 'CJ Dropshipping',
          is_active: true,
          cj_product_id: product.id,
          cj_sku: product.sku,
        });
        imported++;
      }
      return Response.json({ success: true, imported, skipped });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});