import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const CJ_BASE_URL = 'https://developers.cjdropshipping.com/api2.0/v1';

// Get CJ access token using API key
async function getCJAccessToken() {
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
  return data.data.accessToken;
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

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { action, keyword, page = 1, size = 20, categoryId } = body;

    const token = await getCJAccessToken();
    const headers = { 'CJ-Access-Token': token, 'Content-Type': 'application/json' };

    // Search products from CJ
    if (action === 'search') {
      const params = new URLSearchParams({ page: String(page), size: String(size) });
      if (keyword) params.append('keyWord', keyword);
      if (categoryId) params.append('categoryId', categoryId);

      const res = await fetch(`${CJ_BASE_URL}/product/listV2?${params}`, { headers });
      const data = await res.json();

      if (!data.result) {
        return Response.json({ error: data.message || 'CJ API error' }, { status: 400 });
      }

      const products = data.data?.content?.[0]?.productList || [];
      return Response.json({ products, total: data.data?.totalRecords || 0, pages: data.data?.totalPages || 0 });
    }

    // Get shipping cost for a product to Saudi Arabia
    if (action === 'getShipping') {
      const { productId, quantity = 1 } = body;
      if (!productId) return Response.json({ error: 'No productId' }, { status: 400 });

      const res = await fetch(`${CJ_BASE_URL}/logistic/freightCalculate`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          productId,
          quantity,
          countryCode: 'SA', // Saudi Arabia
        }),
      });
      const data = await res.json();

      if (!data.result || !data.data) {
        return Response.json({ shippingCost: 0, options: [] });
      }

      // Return all options and the cheapest one
      const options = (data.data || []).map(o => ({
        name: o.logisticName,
        cost: parseFloat(o.logisticPrice) || 0,
        days: o.logisticAging,
      }));
      const cheapest = options.reduce((a, b) => (a.cost < b.cost ? a : b), options[0] || { cost: 0 });
      const costUSD = cheapest?.cost || 0;
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