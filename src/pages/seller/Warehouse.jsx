import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Search, Plus, Check, ChevronLeft, ChevronRight, Loader2, Package, Tag } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const USD_TO_SAR = 3.75;

const CJ_CATEGORIES = [
  { id: '', label: 'الكل' },
  { id: 'clothing', label: 'ملابس' },
  { id: 'electronics', label: 'إلكترونيات' },
  { id: 'beauty', label: 'جمال وعناية' },
  { id: 'home', label: 'المنزل' },
  { id: 'sports', label: 'رياضة' },
  { id: 'toys', label: 'ألعاب' },
  { id: 'watches', label: 'ساعات' },
  { id: 'bags', label: 'حقائب' },
  { id: 'shoes', label: 'أحذية' },
];

function getCostSAR(product) {
  const raw = product.sellPrice?.split(' -- ')?.[0] || product.sellPrice || '0';
  const usd = parseFloat(raw) || 0;
  return parseFloat((usd * USD_TO_SAR).toFixed(2));
}

function ProductCard({ product, added, onAdd }) {
  const costSAR = getCostSAR(product);
  const defaultSalePrice = parseFloat((costSAR * 1.5).toFixed(2));
  const [salePrice, setSalePrice] = useState(defaultSalePrice || '');
  const [adding, setAdding] = useState(false);

  const profit = salePrice && costSAR > 0 ? parseFloat((salePrice - costSAR).toFixed(2)) : null;
  const profitPct = profit && costSAR > 0 ? Math.round((profit / costSAR) * 100) : null;

  const handleAdd = async () => {
    if (!salePrice || parseFloat(salePrice) <= 0) {
      toast.error('أدخل سعر بيع صحيح');
      return;
    }
    if (parseFloat(salePrice) <= costSAR) {
      toast.error('سعر البيع يجب أن يكون أعلى من سعر التكلفة');
      return;
    }
    setAdding(true);
    await onAdd(product, parseFloat(salePrice), costSAR);
    setAdding(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-md transition flex flex-col"
    >
      <div className="relative">
        <img
          src={product.bigImage || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=300&h=180&fit=crop'}
          alt={product.nameEn}
          className="w-full h-32 object-cover"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=300&h=180&fit=crop'; }}
        />
        {added && (
          <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
            <span className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">✓ مضاف</span>
          </div>
        )}
      </div>

      <div className="p-3 flex flex-col gap-2 flex-1">
        <p className="font-semibold text-xs leading-tight line-clamp-2 text-slate-800">{product.nameEn}</p>
        <p className="text-xs text-slate-400 font-mono bg-slate-50 rounded px-1.5 py-0.5 truncate">SKU: {product.id || product.sku || '—'}</p>

        {/* Cost price (fixed) */}
        <div className="bg-slate-50 rounded-xl px-2.5 py-2 text-xs space-y-1">
          <div className="flex justify-between text-slate-500">
                    <span>سعر الشراء من المنصة</span>
            <span className="font-bold text-slate-700">
              {costSAR > 0 ? `${costSAR} ر.س` : '—'}
            </span>
          </div>
          {profit !== null && profit > 0 && (
            <div className="flex justify-between text-green-600 font-semibold">
              <span>ربحك</span>
              <span>+{profit} ر.س ({profitPct}%)</span>
            </div>
          )}
          {profit !== null && profit <= 0 && (
            <div className="text-red-500 font-semibold text-center">⚠️ سعر البيع أقل من التكلفة!</div>
          )}
        </div>

        {/* Editable sale price */}
        <div>
          <label className="text-xs text-slate-500 mb-1 block flex items-center gap-1">
            <Tag className="w-3 h-3" /> سعر بيعك للعميل (ر.س)
          </label>
          <input
            type="number"
            min={costSAR + 1}
            step="0.5"
            value={salePrice}
            onChange={e => setSalePrice(e.target.value)}
            disabled={added}
            className="w-full h-8 px-2 rounded-lg border border-violet-200 text-sm font-bold text-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-300 text-center disabled:opacity-50 disabled:bg-slate-100"
          />
        </div>

        {/* Add button */}
        {added ? (
          <div className="w-full flex items-center justify-center gap-1 text-xs bg-green-100 text-green-700 py-1.5 rounded-xl font-semibold">
            <Check className="w-3 h-3" /> مضاف للمتجر
          </div>
        ) : (
          <button
            onClick={handleAdd}
            disabled={adding}
            className="w-full flex items-center justify-center gap-1 text-xs bg-violet-600 text-white py-1.5 rounded-xl font-semibold hover:bg-violet-700 transition disabled:opacity-50 mt-auto"
          >
            {adding
              ? <><div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> جاري...</>
              : <><Plus className="w-3 h-3" /> أضف للمتجر</>
            }
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default function WarehousePage({ store, wallet, onWalletUpdate }) {
  const [products, setProducts] = useState([]);
  const [myProductIds, setMyProductIds] = useState(new Set());
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (store) {
      base44.entities.Product.filter({ store_id: store.id }).then(prods => {
        setMyProductIds(new Set(prods.map(p => p.warehouse_product_id).filter(Boolean)));
      });
    }
  }, [store]);

  useEffect(() => {
    setLoading(true);
    setProducts([]);
    const keyword = search.trim() || activeCategory || 'product';
    base44.functions.invoke('cjProducts', { action: 'search', keyword, page, size: 20 })
      .then(res => {
        const data = res.data;
        setProducts(data.products || []);
        setTotal(data.total || 0);
        setTotalPages(data.pages || 1);
        setLoading(false);
      }).catch(() => {
        toast.error('خطأ في تحميل المنتجات');
        setLoading(false);
      });
  }, [search, activeCategory, page]);

  useEffect(() => { setPage(1); }, [search, activeCategory]);

  const handleSearch = (e) => { e.preventDefault(); setSearch(searchInput); };

  const handleAdd = async (product, salePrice, costSAR) => {
    if (!store) { toast.error('لا يوجد متجر'); return; }
    const user = await base44.auth.me();

    // Translate product name to Arabic using AI
    let arabicName = product.nameEn;
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `ترجم اسم المنتج التالي إلى العربية بشكل مختصر واحترافي مناسب للتجارة الإلكترونية. أعطني فقط الاسم المترجم بدون أي شرح:\n${product.nameEn}`,
      });
      if (res && typeof res === 'string' && res.trim()) arabicName = res.trim();
    } catch (_) {}

    await base44.entities.Product.create({
      warehouse_product_id: `cj_${product.id}`,
      store_id: store.id,
      store_name: store.store_name,
      owner_email: user.email,
      name: arabicName,
      description: arabicName,
      category: 'general',
      images: [product.bigImage].filter(Boolean),
      price: salePrice,
      original_price: salePrice,
      cost_price: costSAR,
      brand: product.supplierName || 'R souq',
      stock: product.warehouseInventoryNum || 100,
      rating: 0,
      is_active: true,
    });
    setMyProductIds(prev => new Set([...prev, `cj_${product.id}`]));
    toast.success(`✅ أُضيف "${arabicName}" بسعر ${salePrice} ر.س`);
  };

  return (
    <div className="space-y-5" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-extrabold text-lg">مخزن المنتجات</h2>
          <p className="text-sm text-muted-foreground">اشترِ بسعر المنصة وحدّد سعر بيعك بنفسك — الربح لك أنت</p>
        </div>
        {total > 0 && (
          <div className="bg-violet-50 text-violet-700 text-sm font-semibold px-3 py-1.5 rounded-xl border border-violet-200">
            {total.toLocaleString()} منتج
          </div>
        )}
      </div>

      {/* Info Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-800 flex gap-2 items-start">
        <span className="text-base">💡</span>
        <div>
          <strong>كيف يعمل المخزن؟</strong> — تشوف سعر التكلفة من المنصة، تحط سعر البيع اللي تبيه، والفرق ربحك. بعد ما يشتري العميل، نتولى الشحن مباشرة.
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          placeholder="ابحث في المنتجات..."
          className="flex-1 h-10 pr-4 pl-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
        />
        <button type="submit" className="px-4 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition flex items-center gap-1.5">
          <Search className="w-4 h-4" /> بحث
        </button>
      </form>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 flex-wrap">
        {CJ_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => { setActiveCategory(cat.id); setSearch(''); setSearchInput(''); }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${activeCategory === cat.id ? 'bg-violet-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-violet-300'}`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
          <span className="text-sm">جاري تحميل المنتجات...</span>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground flex flex-col items-center gap-3">
          <Package className="w-10 h-10 text-slate-300" />
          <p>لا توجد نتائج. جرب كلمة بحث أخرى.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              added={myProductIds.has(`cj_${product.id}`)}
              onAdd={handleAdd}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 transition disabled:opacity-40">
            <ChevronRight className="w-4 h-4" />
          </button>
          <span className="text-sm font-semibold">{page} / {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 transition disabled:opacity-40">
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}