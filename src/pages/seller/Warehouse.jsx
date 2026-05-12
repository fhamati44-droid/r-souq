import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Search, Plus, Check, ChevronLeft, ChevronRight, Loader2, Package } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

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

const PROFIT_MARGIN = 1.35;
const SHIPPING_COST = 20;

export default function WarehousePage({ store, wallet, onWalletUpdate }) {
  const [products, setProducts] = useState([]);
  const [myProductIds, setMyProductIds] = useState(new Set());
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Load seller's existing products
  useEffect(() => {
    if (store) {
      base44.entities.Product.filter({ store_id: store.id }).then(prods => {
        setMyProductIds(new Set(prods.map(p => p.warehouse_product_id).filter(Boolean)));
      });
    }
  }, [store]);

  // Fetch from CJ via backend function
  useEffect(() => {
    setLoading(true);
    setProducts([]);

    const keyword = search.trim() || activeCategory || 'product';

    base44.functions.invoke('cjProducts', {
      action: 'search',
      keyword,
      page,
      size: 20,
    }).then(res => {
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

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  const handleAdd = async (product) => {
    if (!store) { toast.error('لا يوجد متجر'); return; }
    setAdding(product.id);

    const user = await base44.auth.me();
    const costPrice = parseFloat(product.sellPrice?.split(' -- ')?.[0] || product.sellPrice || 0);
    const salePrice = parseFloat((costPrice * PROFIT_MARGIN + SHIPPING_COST).toFixed(2));

    await base44.entities.Product.create({
      warehouse_product_id: `cj_${product.id}`,
      store_id: store.id,
      store_name: store.store_name,
      owner_email: user.email,
      name: product.nameEn,
      description: product.nameEn,
      category: 'general',
      images: [product.bigImage].filter(Boolean),
      price: salePrice,
      original_price: salePrice,
      cost_price: costPrice,
      brand: product.supplierName || 'CJ Dropshipping',
      stock: product.warehouseInventoryNum || 100,
      rating: 0,
      is_active: true,
    });

    setMyProductIds(prev => new Set([...prev, `cj_${product.id}`]));
    toast.success(`✅ تمت إضافة "${product.nameEn}" للمتجر`);
    setAdding(null);
  };

  return (
    <div className="space-y-5" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-extrabold text-lg">مخزن CJ Dropshipping</h2>
          <p className="text-sm text-muted-foreground">أضف منتجات مباشرةً إلى متجرك — شامل شحن ({SHIPPING_COST} ر.س) وهامش ربح 35%</p>
        </div>
        {total > 0 && (
          <div className="bg-violet-50 text-violet-700 text-sm font-semibold px-3 py-1.5 rounded-xl border border-violet-200">
            {total.toLocaleString()} منتج
          </div>
        )}
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="relative flex gap-2">
        <input
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          placeholder="ابحث في منتجات CJ..."
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
          <span className="text-sm">جاري تحميل المنتجات من CJ...</span>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground flex flex-col items-center gap-3">
          <Package className="w-10 h-10 text-slate-300" />
          <p>لا توجد نتائج. جرب كلمة بحث أخرى.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {products.map((product, i) => {
            const key = `cj_${product.id}`;
            const added = myProductIds.has(key);
            const costPrice = parseFloat(product.sellPrice?.split(' -- ')?.[0] || product.sellPrice || 0);
            const salePrice = (costPrice * PROFIT_MARGIN + SHIPPING_COST).toFixed(2);

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02 }}
                className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-md transition"
              >
                <img
                  src={product.bigImage || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=300&h=180&fit=crop'}
                  alt={product.nameEn}
                  className="w-full h-32 object-cover"
                  onError={e => { e.target.src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=300&h=180&fit=crop'; }}
                />
                <div className="p-3 space-y-1.5">
                  <p className="font-semibold text-xs leading-tight line-clamp-2">{product.nameEn}</p>
                  {product.sku && <p className="text-xs text-muted-foreground">{product.sku}</p>}

                  <div className="space-y-0.5 text-xs">
                    <div className="flex justify-between text-muted-foreground">
                      <span>التكلفة</span>
                      <span>{costPrice > 0 ? `$${costPrice}` : '—'}</span>
                    </div>
                    <div className="flex justify-between text-violet-700 font-bold border-t border-slate-100 pt-1">
                      <span>سعر البيع</span>
                      <span>{salePrice} ر.س</span>
                    </div>
                  </div>

                  {added ? (
                    <div className="w-full flex items-center justify-center gap-1 text-xs bg-green-100 text-green-700 py-1.5 rounded-xl font-semibold">
                      <Check className="w-3 h-3" /> مضاف
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAdd(product)}
                      disabled={adding === product.id}
                      className="w-full flex items-center justify-center gap-1 text-xs bg-violet-600 text-white py-1.5 rounded-xl font-semibold hover:bg-violet-700 transition disabled:opacity-50"
                    >
                      {adding === product.id
                        ? <><div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> جاري...</>
                        : <><Plus className="w-3 h-3" /> أضف للمتجر</>
                      }
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
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