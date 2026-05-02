import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Search, Plus, Check, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const CATEGORIES = ['all', 'smartphones', 'laptops', 'fragrances', 'skincare', 'groceries', 'home-decoration', 'furniture', 'tops', 'womens-dresses', 'womens-shoes', 'mens-shirts', 'mens-shoes', 'mens-watches', 'womens-watches', 'womens-bags', 'womens-jewellery', 'sunglasses', 'automotive', 'motorcycle', 'lighting'];

const CAT_LABELS = {
  all: 'الكل', smartphones: 'هواتف', laptops: 'لابتوب', fragrances: 'عطور',
  skincare: 'عناية بالبشرة', groceries: 'بقالة', 'home-decoration': 'ديكور',
  furniture: 'أثاث', tops: 'ملابس علوية', 'womens-dresses': 'فساتين',
  'womens-shoes': 'أحذية نساء', 'mens-shirts': 'قمصان رجال', 'mens-shoes': 'أحذية رجال',
  'mens-watches': 'ساعات رجال', 'womens-watches': 'ساعات نساء', 'womens-bags': 'حقائب',
  'womens-jewellery': 'مجوهرات', sunglasses: 'نظارات', automotive: 'سيارات',
  motorcycle: 'دراجات', lighting: 'إضاءة',
};

const SHIPPING_COST = 15; // ر.س شحن ثابت

export default function WarehousePage({ store, wallet, onWalletUpdate }) {
  const [products, setProducts] = useState([]);
  const [myProductIds, setMyProductIds] = useState(new Set());
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  // Load seller's existing products
  useEffect(() => {
    if (store) {
      base44.entities.Product.filter({ store_id: store.id }).then(prods => {
        setMyProductIds(new Set(prods.map(p => p.warehouse_product_id).filter(Boolean)));
      });
    }
  }, [store]);

  // Fetch from DummyJSON
  useEffect(() => {
    setLoading(true);
    const skip = (page - 1) * limit;
    let url = '';

    if (search.trim()) {
      url = `https://dummyjson.com/products/search?q=${encodeURIComponent(search)}&limit=${limit}&skip=${skip}`;
    } else if (category !== 'all') {
      url = `https://dummyjson.com/products/category/${category}?limit=${limit}&skip=${skip}`;
    } else {
      url = `https://dummyjson.com/products?limit=${limit}&skip=${skip}`;
    }

    fetch(url)
      .then(r => r.json())
      .then(data => {
        setProducts(data.products || []);
        setTotal(data.total || 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [search, category, page]);

  // Reset page on filter change
  useEffect(() => { setPage(1); }, [search, category]);

  const handleAdd = async (product) => {
    if (!store) { toast.error('لا يوجد متجر'); return; }
    setAdding(product.id);
    try {
      const user = await base44.auth.me();
      const totalPrice = parseFloat((product.price + SHIPPING_COST).toFixed(2));

      await base44.entities.Product.create({
        warehouse_product_id: `dj_${product.id}`,
        store_id: store.id,
        store_name: store.store_name,
        owner_email: user.email,
        name: product.title,
        description: product.description,
        category: mapCategory(product.category),
        images: product.images || [product.thumbnail],
        price: totalPrice,
        original_price: totalPrice,
        cost_price: product.price,
        brand: product.brand || '',
        stock: product.stock || 100,
        rating: product.rating || 0,
        is_active: true,
        tags: product.tags || [],
      });

      setMyProductIds(prev => new Set([...prev, `dj_${product.id}`]));
      toast.success(`✅ تمت إضافة "${product.title}" (شامل شحن ${SHIPPING_COST} ر.س)`);
    } catch (e) {
      toast.error('حدث خطأ');
    }
    setAdding(null);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-5" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-extrabold text-lg">مخزن المنتجات</h2>
          <p className="text-sm text-muted-foreground">اختر المنتجات وأضفها لمتجرك — السعر شامل الشحن ({SHIPPING_COST} ر.س)</p>
        </div>
        <div className="bg-violet-50 text-violet-700 text-sm font-semibold px-3 py-1.5 rounded-xl border border-violet-200">
          {total} منتج متاح
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="ابحث في المنتجات..."
          className="w-full h-10 pr-9 pl-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
        />
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.slice(0, 12).map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${category === cat ? 'bg-violet-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-violet-300'}`}
          >
            {CAT_LABELS[cat] || cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl h-56 animate-pulse border border-slate-100" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">لا توجد نتائج</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {products.map((product, i) => {
            const productKey = `dj_${product.id}`;
            const alreadyAdded = myProductIds.has(productKey);
            const totalPrice = (product.price + SHIPPING_COST).toFixed(2);

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02 }}
                className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-md transition"
              >
                <div className="relative">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-full h-32 object-cover"
                  />
                  {product.discountPercentage > 0 && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
                      -{Math.round(product.discountPercentage)}%
                    </span>
                  )}
                </div>
                <div className="p-3 space-y-1.5">
                  <p className="font-semibold text-xs truncate">{product.title}</p>
                  {product.brand && <p className="text-xs text-muted-foreground">{product.brand}</p>}

                  <div className="space-y-0.5">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>سعر المنتج</span>
                      <span>${product.price}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>الشحن</span>
                      <span>{SHIPPING_COST} ر.س</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-bold text-violet-700 border-t border-slate-100 pt-1">
                      <span>الإجمالي</span>
                      <span>{totalPrice} ر.س</span>
                    </div>
                  </div>

                  {alreadyAdded ? (
                    <div className="w-full flex items-center justify-center gap-1 text-xs bg-green-100 text-green-700 py-1.5 rounded-xl font-semibold">
                      <Check className="w-3 h-3" /> مضاف
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAdd(product)}
                      disabled={adding === product.id}
                      className="w-full flex items-center justify-center gap-1 text-xs bg-violet-600 text-white py-1.5 rounded-xl font-semibold hover:bg-violet-700 transition disabled:opacity-50"
                    >
                      {adding === product.id ? (
                        <span className="flex items-center gap-1"><div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> جاري...</span>
                      ) : (
                        <><Plus className="w-3 h-3" /> أضف للمتجر</>
                      )}
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
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 transition disabled:opacity-40"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <span className="text-sm font-semibold">{page} / {totalPages}</span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 transition disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

function mapCategory(cat) {
  const map = {
    smartphones: 'electronics', laptops: 'electronics', automotive: 'general',
    motorcycle: 'general', lighting: 'home', furniture: 'home',
    'home-decoration': 'home', tops: 'clothing', 'womens-dresses': 'clothing',
    'womens-shoes': 'clothing', 'mens-shirts': 'clothing', 'mens-shoes': 'clothing',
    'mens-watches': 'general', 'womens-watches': 'general', 'womens-bags': 'general',
    'womens-jewellery': 'general', sunglasses: 'general', fragrances: 'beauty',
    skincare: 'beauty', groceries: 'food',
  };
  return map[cat] || 'general';
}